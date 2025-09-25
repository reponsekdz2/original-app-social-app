import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// POST /api/comments/:id/like - Like a comment
router.post('/:id/like', isAuthenticated, async (req, res) => {
    const { id: commentId } = req.params;
    const userId = req.session.userId;

    try {
        const [[existingLike]] = await pool.query(
            'SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?',
            [commentId, userId]
        );

        if (existingLike) {
            // Unlike
            await pool.query('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
        } else {
            // Like
            await pool.query('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error(`Error toggling like for comment ${commentId}:`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


export default router;