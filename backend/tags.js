import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/tags/:tag
router.get('/:tag', isAuthenticated, async (req, res) => {
    const { tag } = req.params;

    try {
        // This is a simplified search. A more robust implementation
        // would use a dedicated `tags` and `post_tags` table.
        const [posts] = await pool.query(`
            SELECT p.*, u.username, u.avatar_url,
                   (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes,
                   (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.caption LIKE ? AND p.is_archived = 0 AND u.is_private = 0
            ORDER BY p.created_at DESC
        `, [`%#${tag}%`]);
        
        // You could also search reels and combine the results.

        res.json(posts);
    } catch (error) {
        console.error(`Error fetching posts for tag #${tag}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;