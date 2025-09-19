import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// --- Multer Setup for Avatar Uploads ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public (but needs auth for follow status)
router.get('/:username', protect, async (req, res) => {
    const { username } = req.params;
    const currentUserId = req.user.id;

    try {
        const [users] = await pool.query(
            `SELECT 
                u.id, u.username, u.name, u.avatar_url as avatar, u.bio, u.website, u.is_verified, u.is_private,
                (SELECT COUNT(*) FROM followers WHERE following_id = u.id) as follower_count,
                (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) as following_count,
                EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = u.id) as is_followed_by_user,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'media', (SELECT JSON_OBJECT('url', pm.media_url, 'type', pm.media_type) FROM post_media pm WHERE pm.post_id = p.id LIMIT 1))) FROM posts p WHERE p.user_id = u.id AND p.is_archived = FALSE) as posts,
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', h.id, 'title', h.title, 'cover', h.cover_url)) FROM highlights h WHERE h.user_id = u.id) as highlights
            FROM users u WHERE u.username = ?`,
            [currentUserId, username]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Follow a user
// @route   POST /api/users/:userId/follow
// @access  Private
router.post('/:userId/follow', protect, async (req, res) => {
    const userToFollowId = req.params.userId;
    const currentUserId = req.user.id;
    
    if (userToFollowId === currentUserId.toString()) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [currentUserId, userToFollowId]);
        
        // Create Notification
        await pool.query(
            'INSERT INTO notifications (recipient_id, actor_id, notification_type) VALUES (?, ?, ?)',
            [userToFollowId, currentUserId, 'follow']
        );
        // TODO: Emit socket event for new notification

        res.json({ success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already following this user.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Unfollow a user
// @route   POST /api/users/:userId/unfollow
// @access  Private
router.post('/:userId/unfollow', protect, async (req, res) => {
    const userToUnfollowId = req.params.userId;
    const currentUserId = req.user.id;
    try {
        await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, userToUnfollowId]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
    const { name, username, bio, website, gender } = req.body;
    const userId = req.user.id;
    let avatarUrl = req.user.avatar;

    if (req.file) {
        avatarUrl = `/uploads/${req.file.filename}`;
    }

    try {
        await pool.query(
            'UPDATE users SET name = ?, username = ?, bio = ?, website = ?, gender = ?, avatar_url = ? WHERE id = ?',
            [name, username, bio, website, gender, avatarUrl, userId]
        );
        const [rows] = await pool.query('SELECT id, username, name, email, avatar_url as avatar, is_premium, is_verified, is_private FROM users WHERE id = ?', [userId]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
    const { isPrivate, likes, comments, follows } = req.body;
    const userId = req.user.id;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('UPDATE users SET is_private = ? WHERE id = ?', [isPrivate, userId]);
        await connection.query(
            `INSERT INTO user_settings (user_id, likes_notifications, comments_notifications, follows_notifications) 
            VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE 
            likes_notifications = VALUES(likes_notifications), 
            comments_notifications = VALUES(comments_notifications), 
            follows_notifications = VALUES(follows_notifications)`,
            [userId, likes, comments, follows]
        );

        await connection.commit();
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// @desc    Create a new highlight
// @route   POST /api/users/highlights
// @access  Private
router.post('/highlights', protect, async (req, res) => {
    const { title, storyIds } = req.body;
    const userId = req.user.id;

    if (!title || !storyIds || storyIds.length === 0) {
        return res.status(400).json({ message: 'Title and at least one story are required.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Use the first story's media as the cover
        const [coverRows] = await connection.query('SELECT media_url FROM story_items WHERE id = ?', [storyIds[0]]);
        if(coverRows.length === 0) {
             throw new Error("Cover story not found");
        }
        const coverUrl = coverRows[0].media_url;

        const [highlightResult] = await connection.query(
            'INSERT INTO highlights (user_id, title, cover_url) VALUES (?, ?, ?)',
            [userId, title, coverUrl]
        );
        const highlightId = highlightResult.insertId;

        for (const storyId of storyIds) {
            await connection.query(
                'INSERT INTO highlight_stories (highlight_id, story_item_id) VALUES (?, ?)',
                [highlightId, storyId]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Highlight created successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});


export default router;
