import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/notifications
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [notifications] = await pool.query(`
            SELECT 
                n.id, n.type, n.entity_id, n.read_status, n.created_at as timestamp,
                a.id as actor_id, a.username as actor_username, a.avatar_url as actor_avatar,
                p.id as post_id, (SELECT media_url FROM post_media WHERE post_id = p.id LIMIT 1) as post_media_url
            FROM notifications n
            JOIN users a ON n.actor_id = a.id
            LEFT JOIN posts p ON n.entity_id = p.id AND n.type IN ('like_post', 'comment_post')
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC
            LIMIT 50
        `, [req.session.userId]);

        const formatted = notifications.map(n => ({
            id: n.id,
            type: n.type,
            read_status: n.read_status,
            timestamp: n.timestamp,
            actor: {
                id: n.actor_id,
                username: n.actor_username,
                avatar_url: n.actor_avatar,
            },
            post: n.post_id ? {
                id: n.post_id,
                media: [{ id: 'media1', url: n.post_media_url, type: 'image' }] // Simplified for panel
            } : null,
            commentText: n.type.includes('comment') ? '...' : '' // simplified
        }));

        res.json(formatted);

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// POST /api/notifications/read
router.post('/read', isAuthenticated, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET read_status = 1 WHERE user_id = ?', [req.session.userId]);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


export default router;
