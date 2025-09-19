import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

const getReelById = async (reelId) => {
    const [reelRows] = await pool.query(`
        SELECT 
            r.id, r.caption, r.video_url as video, r.created_at as timestamp,
            u.id as user_id, u.username, u.name, u.avatar_url as avatar
        FROM reels r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = ?`, [reelId]);
    
    if (reelRows.length === 0) return null;
    let reel = reelRows[0];
    reel.user = { id: reel.user_id, username: reel.username, name: reel.name, avatar: reel.avatar };
    
    const [likes] = await pool.query('SELECT user_id FROM reel_likes WHERE reel_id = ?', [reelId]);
    reel.likedBy = likes.map(l => l.user_id);
    reel.likes = likes.length;

    // Simplified comments fetching
    const [comments] = await pool.query('SELECT id FROM comments WHERE reel_id = ?', [reelId]);
    reel.comments = comments;

    return reel;
};

// @desc    Toggle like on a reel
// @route   POST /api/reels/:id/toggle-like
// @access  Private
router.post('/:id/toggle-like', protect, async (req, res) => {
    const reelId = req.params.id;
    const userId = req.user.id;
    try {
        const [existingLike] = await pool.query('SELECT * FROM reel_likes WHERE user_id = ? AND reel_id = ?', [userId, reelId]);
        
        if (existingLike.length > 0) {
            await pool.query('DELETE FROM reel_likes WHERE user_id = ? AND reel_id = ?', [userId, reelId]);
        } else {
            await pool.query('INSERT INTO reel_likes (user_id, reel_id) VALUES (?, ?)', [userId, reelId]);
        }
        
        const updatedReel = await getReelById(reelId);
        req.app.get('io').emit('reel_updated', updatedReel);
        res.json(updatedReel);

    } catch (error) {
        console.error('Toggle Reel Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Add a comment to a reel
// @route   POST /api/reels/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
    const reelId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;
    
    if(!text) return res.status(400).json({ message: 'Comment text is required.' });

    try {
        await pool.query(
            'INSERT INTO comments (user_id, reel_id, text) VALUES (?, ?, ?)',
            [userId, reelId, text]
        );
        
        const updatedReel = await getReelById(reelId);
        req.app.get('io').emit('reel_updated', updatedReel);
        res.status(201).json(updatedReel);
    } catch (error) {
        console.error('Add Reel Comment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
