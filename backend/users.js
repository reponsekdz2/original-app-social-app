import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import { getSocketFromUserId } from './socket.js';

const router = Router();

// @desc    Get all users (for search/tagging)
// @route   GET /api/users
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, name, avatar_url as avatar, is_verified FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get current user's account status and warnings
// @route   GET /api/users/account-status
// @access  Private
router.get('/account-status', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [[user]] = await pool.query('SELECT status FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const [warnings] = await pool.query('SELECT id, reason, created_at, admin_user_id FROM user_warnings WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json({
            status: user.status,
            warnings: warnings
        });
    } catch (error) {
        console.error("Get Account Status Error:", error);
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
    
    if (followerId === followingId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    try {
        await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
        
        const [notifResult] = await pool.query(
            'INSERT INTO notifications (user_id, actor_id, type) VALUES (?, ?, ?)',
            [followingId, followerId, 'follow']
        );
        const [newNotif] = await pool.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar FROM notifications n JOIN users u ON n.actor_id = u.id WHERE n.id = ?', [notifResult.insertId]);

        const targetSocket = getSocketFromUserId(followingId);
        if (targetSocket) {
            targetSocket.emit('new_notification', newNotif[0]);
        }
        
        res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already following this user' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
router.post('/:id/unfollow', protect, async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;
    try {
        await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Block a user
// @route   POST /api/users/:id/block
// @access  Private
router.post('/:id/block', protect, async (req, res) => {
    const userId = req.user.id;
    const blockedUserId = req.params.id;
    if (userId === blockedUserId) {
        return res.status(400).json({ message: "You cannot block yourself." });
    }
    try {
        await pool.query('INSERT INTO blocked_users (user_id, blocked_user_id) VALUES (?, ?)', [userId, blockedUserId]);
        // Also remove any follow relationship
        await pool.query('DELETE FROM followers WHERE (follower_id = ? AND following_id = ?) OR (follower_id = ? AND following_id = ?)', [userId, blockedUserId, blockedUserId, userId]);
        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.json({ message: 'User already blocked' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Unblock a user
// @route   POST /api/users/:id/unblock
// @access  Private
router.post('/:id/unblock', protect, async (req, res) => {
    const userId = req.user.id;
    const blockedUserId = req.params.id;
    try {
        await pool.query('DELETE FROM blocked_users WHERE user_id = ? AND blocked_user_id = ?', [userId, blockedUserId]);
        res.json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get blocked users list
// @route   GET /api/users/blocked
// @access  Private
router.get('/blocked', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [blockedUsers] = await pool.query(
            `SELECT u.id, u.username, u.name, u.avatar_url as avatar, u.is_verified 
             FROM users u 
             JOIN blocked_users bu ON u.id = bu.blocked_user_id 
             WHERE bu.user_id = ?`,
            [userId]
        );
        res.json(blockedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Mute or unmute a user
// @route   POST /api/users/:id/mute
// @access  Private
router.post('/:id/mute', protect, async (req, res) => {
    const userId = req.user.id;
    const mutedUserId = req.params.id;
    if (userId === mutedUserId) {
        return res.status(400).json({ message: "You cannot mute yourself." });
    }
    try {
        const [existing] = await pool.query('SELECT * FROM muted_users WHERE user_id = ? AND muted_user_id = ?', [userId, mutedUserId]);
        if (existing.length > 0) {
            await pool.query('DELETE FROM muted_users WHERE user_id = ? AND muted_user_id = ?', [userId, mutedUserId]);
            res.json({ message: 'User unmuted successfully' });
        } else {
            await pool.query('INSERT INTO muted_users (user_id, muted_user_id) VALUES (?, ?)', [userId, mutedUserId]);
            res.json({ message: 'User muted successfully' });
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.json({ message: 'User already muted' });
        }
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
        return res.status(400).json({ message: 'Title and at least one story are required.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const [coverStory] = await connection.query('SELECT media_url FROM story_items WHERE id = ?', [storyIds[0]]);
        if (coverStory.length === 0) {
            throw new Error('Cover story not found');
        }

        const [result] = await connection.query(
            'INSERT INTO story_highlights (user_id, title, cover_image_url) VALUES (?, ?, ?)',
            [userId, title, coverStory[0].media_url]
        );
        const highlightId = result.insertId;

        const storyLinkPromises = storyIds.map(storyId => 
            connection.query('INSERT INTO highlight_stories (highlight_id, story_item_id) VALUES (?, ?)', [highlightId, storyId])
        );
        await Promise.all(storyLinkPromises);
        
        await connection.commit();
        res.status(201).json({ message: 'Highlight created successfully' });
    } catch (error) {
        await connection.rollback();
        console.error("Create Highlight Error:", error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        connection.release();
    }
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    const { name, bio, website, gender } = req.body;
    const userId = req.user.id;
    try {
        await pool.query(
            'UPDATE users SET name = ?, bio = ?, website = ?, gender = ? WHERE id = ?',
            [name, bio, website, gender, userId]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error("Update Profile Error:", error);
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

        if (typeof isPrivate === 'boolean') {
            await connection.query('UPDATE users SET is_private = ? WHERE id = ?', [isPrivate, userId]);
        }
        
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both new and existing settings
        await connection.query(
            `INSERT INTO user_settings (user_id, likes_notifications, comments_notifications, follows_notifications)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                likes_notifications = VALUES(likes_notifications),
                comments_notifications = VALUES(comments_notifications),
                follows_notifications = VALUES(follows_notifications)`,
            [userId, likes, comments, follows]
        );
        
        await connection.commit();
        res.json({ message: 'Settings updated successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error("Update Settings Error:", error);
        res.status(500).json({ message: 'Server error while updating settings.' });
    } finally {
        connection.release();
    }
});


export default router;