
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/search?q=<query>
router.get('/', isAuthenticated, async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required.' });
    }

    const searchQuery = `%${query}%`;

    try {
        const [users] = await pool.query(
            'SELECT id, username, name, avatar_url, is_verified FROM users WHERE username LIKE ? OR name LIKE ? LIMIT 10',
            [searchQuery, searchQuery]
        );

        const [posts] = await pool.query(
            `SELECT p.id, p.caption, (SELECT media_url FROM post_media WHERE post_id = p.id LIMIT 1) as media_url 
             FROM posts p WHERE p.caption LIKE ? AND p.is_archived = 0 LIMIT 20`,
            [searchQuery]
        );

        res.json({ users, posts });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
