import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Get all reels
// @route   GET /api/reels
// @access  Private
router.get('/', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [reels] = await pool.query(
            `SELECT 
                r.id, r.video_url as video, r.caption, r.shares_count as shares, r.created_at as timestamp,
                JSON_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar_url, 'is_verified', u.is_verified) as user,
                (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) as likes,
                EXISTS(SELECT 1 FROM reel_likes WHERE reel_id = r.id AND user_id = ?) as is_liked_by_user,
                (SELECT COUNT(*) FROM comments WHERE reel_id = r.id) as comment_count
            FROM reels r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC`,
            [userId]
        );
        res.json({ reels });
    } catch (error) {
        console.error('Get Reels Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Like/unlike a reel
// @route   POST /api/reels/:reelId/like
// @access  Private
router.post('/:reelId/like', protect, async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.id;

    try {
        const [isLiked] = await pool.query('SELECT * FROM reel_likes WHERE user_id = ? AND reel_id = ?', [userId, reelId]);

        if (isLiked.length > 0) {
            await pool.query('DELETE FROM reel_likes WHERE user_id = ? AND reel_id = ?', [userId, reelId]);
            res.json({ liked: false });
        } else {
            await pool.query('INSERT INTO reel_likes (user_id, reel_id) VALUES (?, ?)', [userId, reelId]);
             // TODO: Create a notification and emit socket event
            res.json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Comment on a reel
// @route   POST /api/reels/:reelId/comment
// @access  Private
router.post('/:reelId/comment', protect, async (req, res) => {
    const { reelId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO comments (user_id, reel_id, text) VALUES (?, ?, ?)',
            [userId, reelId, text]
        );
        
        const [newComment] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
        // TODO: Create a notification and emit socket event
        
        res.status(201).json(newComment[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
