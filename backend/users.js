import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { getSocketByUserId } from './socket.js';


const router = Router();

// --- Multer Setup for Avatar ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// A reusable function to get a full user profile (Optimized)
const getUserProfile = async (username, currentUserId) => {
    const [users] = await pool.query(`
        SELECT 
            u.id, u.username, u.name, u.avatar_url as avatar, u.bio, u.website, u.is_verified, u.is_premium, u.is_private,
            (SELECT COUNT(*) FROM followers WHERE following_id = u.id) as followerCount,
            (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) as followingCount,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND is_archived = FALSE) as postCount,
            EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = u.id) as isFollowing,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT('id', h.id, 'title', h.title, 'cover', h.cover_image_url)
            ) FROM story_highlights h WHERE h.user_id = u.id) as highlights,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', p.id, 
                    'media', (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pm.media_url, 'type', pm.media_type)) FROM post_media pm WHERE pm.post_id = p.id),
                    'likes', (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id),
                    'comments_count', (SELECT COUNT(*) FROM comments WHERE post_id = p.id)
                )
            ) FROM posts p WHERE p.user_id = u.id AND p.is_archived = FALSE) as posts,
             (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', r.id, 
                    'video', r.video_url,
                    'likes', (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id),
                    'comments_count', (SELECT COUNT(*) FROM comments WHERE reel_id = r.id)
                )
            ) FROM reels r WHERE r.user_id = u.id) as reels
        FROM users u
        WHERE u.username = ?
    `, [currentUserId, username]);

    if (users.length === 0) return null;
    
    // Convert NULL JSON arrays to empty arrays
    const user = users[0];
    user.highlights = user.highlights || [];
    user.posts = user.posts || [];
    user.reels = user.reels || [];

    return user;
};


// @desc    Get user profile
// @route   GET /api/users/profile/:username
// @access  Private
router.get('/profile/:username', protect, async (req, res) => {
    try {
        const userProfile = await getUserProfile(req.params.username, req.user.id);
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userProfile);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
    const { username, name, bio, website, gender } = req.body;
    const userId = req.user.id;
    
    let avatarUrl = req.user.avatar;
    if (req.file) {
        avatarUrl = `/uploads/${req.file.filename}`;
    }

    try {
        await pool.query(
            'UPDATE users SET username = ?, name = ?, bio = ?, website = ?, gender = ?, avatar_url = ? WHERE id = ?',
            [username, name, bio, website, gender, avatarUrl, userId]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
router.post('/:id/follow', protect, async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;
    const io = req.app.get('io');
    
    if (followerId == followingId) return res.status(400).json({ message: "You cannot follow yourself." });

    try {
        await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
        
        // Create and emit notification
        const [notifResult] = await pool.query(
            'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
            [followingId, followerId, 'follow', followerId]
        );
        const [newNotif] = await pool.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar FROM notifications n JOIN users u ON n.actor_id = u.id WHERE n.id = ?', [notifResult.insertId]);

        const targetSocket = getSocketByUserId(io, followingId);
        if (targetSocket) {
            targetSocket.emit('new_notification', newNotif[0]);
        }

        res.json({ message: 'Followed user successfully' });
    } catch (error) {
        console.error('Follow Error:', error);
        // Handle case where relationship already exists
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ message: 'Already following this user.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/unfollow
// @access  Private
router.delete('/:id/unfollow', protect, async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;
    try {
        await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        res.json({ message: 'Unfollowed user successfully' });
    } catch (error) {
        console.error('Unfollow Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Create a story highlight
// @route   POST /api/users/highlights
// @access  Private
router.post('/highlights', protect, async (req, res) => {
    const { title, storyIds } = req.body;
    const userId = req.user.id;
    if (!title || !storyIds || storyIds.length === 0) {
        return res.status(400).json({ message: 'Title and story IDs are required' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Use the first story's media as the cover
        const [firstStory] = await connection.query('SELECT media_url FROM story_items WHERE id = ?', [storyIds[0]]);
        if (firstStory.length === 0) throw new Error('Cover story not found');

        const coverImageUrl = firstStory[0].media_url;

        const [result] = await connection.query(
            'INSERT INTO story_highlights (user_id, title, cover_image_url) VALUES (?, ?, ?)',
            [userId, title, coverImageUrl]
        );
        const highlightId = result.insertId;
        
        const highlightStoriesPromises = storyIds.map(storyId => {
            return connection.query('INSERT INTO highlight_stories (highlight_id, story_item_id) VALUES (?, ?)', [highlightId, storyId]);
        });
        await Promise.all(highlightStoriesPromises);

        await connection.commit();
        res.status(201).json({ message: 'Highlight created successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Create Highlight Error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
    const { isPrivate, likes, comments, follows } = req.body;
    const userId = req.user.id;
    try {
        if (typeof isPrivate !== 'undefined') {
            await pool.query('UPDATE users SET is_private = ? WHERE id = ?', [isPrivate, userId]);
        }
        await pool.query(
            `INSERT INTO user_settings (user_id, likes_notifications, comments_notifications, follows_notifications) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE likes_notifications = VALUES(likes_notifications), comments_notifications = VALUES(comments_notifications), follows_notifications = VALUES(follows_notifications)`,
            [userId, likes, comments, follows]
        );
        res.json({ message: 'Settings updated successfully.' });
    } catch(error) {
        console.error('Update Settings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Apply for verification (mock)
// @route   POST /api/users/verification
// @access  Private
router.post('/verification', protect, (req, res) => {
    // In a real app, this would save the application to a DB for review.
    res.status(201).json({ message: "Verification application submitted successfully. We will review it shortly." });
});

// @desc    Mute/Unmute a user
// @route   POST /api/users/:id/relationship
// @access  Private
router.post('/:id/relationship', protect, async (req, res) => {
    const { action } = req.body; // 'mute', 'unmute', 'block', 'unblock'
    const userId = req.user.id;
    const targetUserId = req.params.id;
    
    try {
        if (action === 'mute') {
            await pool.query('INSERT INTO muted_users (user_id, muted_user_id) VALUES (?, ?)', [userId, targetUserId]);
        } else if (action === 'unmute') {
            await pool.query('DELETE FROM muted_users WHERE user_id = ? AND muted_user_id = ?', [userId, targetUserId]);
        } else if (action === 'block') {
            await pool.query('INSERT INTO blocked_users (user_id, blocked_user_id) VALUES (?, ?)', [userId, targetUserId]);
        } else if (action === 'unblock') {
            await pool.query('DELETE FROM blocked_users WHERE user_id = ? AND blocked_user_id = ?', [userId, targetUserId]);
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }
        res.json({ message: `User ${action}ed successfully.` });
    } catch (error) {
        console.error('Update relationship error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
    try {
        const [notifications] = await pool.query(`
            SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar 
            FROM notifications n 
            JOIN users u ON n.actor_id = u.id 
            WHERE n.user_id = ? 
            ORDER BY n.created_at DESC`, [req.user.id]);
        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Mark notifications as read
// @route   POST /api/users/notifications/read
// @access  Private
router.post('/notifications/read', protect, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET read_status = TRUE WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'Notifications marked as read.' });
    } catch(error) {
        console.error('Mark Notifications Read Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;