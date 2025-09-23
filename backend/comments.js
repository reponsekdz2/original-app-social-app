import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// POST /api/comments
router.post('/', isAuthenticated, async (req, res) => {
    const { postId, reelId, text } = req.body;
    const userId = req.session.userId;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }
    if (!postId && !reelId) {
        return res.status(400).json({ message: 'A comment must be associated with a post or a reel.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO comments (post_id, reel_id, user_id, text) VALUES (?, ?, ?, ?)',
            [postId || null, reelId || null, userId, text]
        );
        
        const [newComment] = await pool.query(`
            SELECT c.*, u.username, u.avatar_url FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.id = ?`, [result.insertId]);

        res.status(201).json(newComment[0]);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
