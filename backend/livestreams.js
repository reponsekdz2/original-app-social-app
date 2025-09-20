import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Start a new live stream
// @route   POST /api/livestreams/start
// @access  Private
router.post('/start', protect, async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    try {
        const [result] = await pool.query(
            'INSERT INTO live_streams (user_id, title) VALUES (?, ?)',
            [userId, title]
        );
        const streamId = result.insertId;
        const [streamRows] = await pool.query(`
            SELECT ls.*, JSON_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar_url) as user 
            FROM live_streams ls 
            JOIN users u ON ls.user_id = u.id
            WHERE ls.id = ?
        `, [streamId]);
        res.status(201).json(streamRows[0]);
    } catch (error) {
        console.error('Start Stream Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    End a live stream
// @route   POST /api/livestreams/:id/end
// @access  Private
router.post('/:id/end', protect, async (req, res) => {
    const streamId = req.params.id;
    const userId = req.user.id;
    try {
        const [result] = await pool.query(
            "UPDATE live_streams SET status = 'ended', ended_at = NOW() WHERE id = ? AND user_id = ?",
            [streamId, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Stream not found or you are not authorized to end it.' });
        }
        res.json({ message: 'Stream ended successfully.' });
    } catch (error) {
        console.error('End Stream Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all active live streams
// @route   GET /api/livestreams
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const [streams] = await pool.query(`
            SELECT 
                ls.id, ls.title, ls.started_at,
                JSON_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar_url) as user
            FROM live_streams ls
            JOIN users u ON ls.user_id = u.id
            WHERE ls.status = 'live'
            ORDER BY ls.started_at DESC
        `);
        res.json(streams);
    } catch (error) {
        console.error('Get Live Streams Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;