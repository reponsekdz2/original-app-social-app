import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Like/unlike a comment
// @route   POST /api/comments/:commentId/like
// @access  Private
router.post('/:commentId/like', protect, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const [isLiked] = await pool.query('SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?', [userId, commentId]);

        if (isLiked.length > 0) {
            await pool.query('DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?', [userId, commentId]);
            res.json({ liked: false });
        } else {
            await pool.query('INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)', [userId, commentId]);
            // TODO: Create a notification for the comment author
            res.json({ liked: true });
        }
    } catch (error) {
        console.error('Like Comment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
