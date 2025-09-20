import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Get sponsored content for the sidebar
// @route   GET /api/misc/sponsored
// @access  Private
router.get('/sponsored', protect, async (req, res) => {
    try {
        const [content] = await pool.query('SELECT * FROM sponsored_content LIMIT 3');
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get trending topics for the sidebar
// @route   GET /api/misc/trending
// @access  Private
router.get('/trending', protect, async (req, res) => {
    try {
        const [topics] = await pool.query('SELECT * FROM trending_topics ORDER BY post_count DESC LIMIT 5');
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get stickers for messaging
// @route   GET /api/misc/stickers
// @access  Private
router.get('/stickers', protect, async (req, res) => {
    // In a real app, this would come from a database.
    const mockStickers = [
        '/uploads/stickers/sticker1.webp',
        '/uploads/stickers/sticker2.webp',
        '/uploads/stickers/sticker3.webp',
        '/uploads/stickers/sticker4.webp',
    ];
    res.json(mockStickers);
});

// @desc    Get suggestions for who to follow
// @route   GET /api/misc/suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [users] = await pool.query(`
            SELECT u.id, u.username, u.name, u.avatar_url as avatar, u.is_verified
            FROM users u
            WHERE u.id != ? AND u.id NOT IN (SELECT following_id FROM followers WHERE follower_id = ?)
            ORDER BY RAND()
            LIMIT 5
        `, [userId, userId]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get recent feed activity
// @route   GET /api/misc/feed-activity
// @access  Private
router.get('/feed-activity', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        // A complex query to fetch recent likes and follows from people the user follows
        const [activities] = await pool.query(`
            (SELECT 
                'liked' as action, 
                actor.id as user_id, actor.username as user_username, actor.name as user_name, actor.avatar_url as user_avatar,
                target_post_user.id as target_user_id, target_post_user.username as target_user_username, target_post_user.name as target_user_name,
                p.id as target_post_id,
                pl.created_at as timestamp
            FROM post_likes pl
            JOIN users actor ON pl.user_id = actor.id
            JOIN posts p ON pl.post_id = p.id
            JOIN users target_post_user ON p.user_id = target_post_user.id
            WHERE pl.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) AND p.user_id != ?
            ORDER BY pl.created_at DESC
            LIMIT 5)
            UNION ALL
            (SELECT 
                'followed' as action,
                actor.id as user_id, actor.username as user_username, actor.name as user_name, actor.avatar_url as user_avatar,
                target_user.id as target_user_id, target_user.username as target_user_username, target_user.name as target_user_name,
                NULL as target_post_id,
                f.created_at as timestamp
            FROM followers f
            JOIN users actor ON f.follower_id = actor.id
            JOIN users target_user ON f.following_id = target_user.id
            WHERE f.follower_id IN (SELECT following_id FROM followers WHERE follower_id = ?) AND f.following_id != ?
            ORDER BY f.created_at DESC
            LIMIT 5)
            ORDER BY timestamp DESC
            LIMIT 5;
        `, [userId, userId, userId, userId]);

        const formatted = activities.map(a => ({
            id: `${a.action}-${a.user_id}-${a.timestamp}`,
            action: a.action,
            user: { id: a.user_id, username: a.user_username, name: a.user_name, avatar: a.user_avatar },
            targetUser: a.action === 'followed' ? { id: a.target_user_id, username: a.target_user_username, name: a.target_user_name } : null,
            targetPost: a.action === 'liked' ? { id: a.target_post_id, user: { id: a.target_user_id, username: a.target_user_username, name: a.target_user_name } } : null,
            timestamp: a.timestamp
        }));
        
        res.json(formatted);
    } catch (error) {
        console.error("Feed Activity Error:", error)
        res.status(500).json({ message: 'Server Error' });
    }
});

// Fix: Add a new endpoint to fetch notifications for the current user.
// @desc    Get user notifications
// @route   GET /api/misc/notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [notifications] = await pool.query(`
            SELECT 
                n.id, 
                n.type, 
                n.created_at as timestamp,
                JSON_OBJECT('id', actor.id, 'username', actor.username, 'avatar', actor.avatar_url) as user,
                (SELECT text FROM comments WHERE id = n.entity_id AND n.type = 'comment') as commentText,
                (SELECT JSON_OBJECT('id', p.id, 'media', (SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pm.media_url)) FROM post_media pm WHERE pm.post_id = p.id LIMIT 1)) FROM posts p WHERE p.id = n.entity_id AND (n.type = 'like' OR n.type = 'comment')) as post
            FROM notifications n
            JOIN users actor ON n.actor_id = actor.id
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC
            LIMIT 50
        `, [userId]);
        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;