
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/livestreams - Get all active streams
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [streams] = await pool.query(`
            SELECT 
                ls.id, ls.title, ls.started_at, ls.status,
                u.id as user_id, u.username, u.avatar_url
            FROM livestreams ls
            JOIN users u ON ls.user_id = u.id
            WHERE ls.status = 'live'
        `);
        // In a real app we would map this to the User type properly
        const formattedStreams = streams.map(s => ({
            id: s.id,
            title: s.title,
            started_at: s.started_at,
            status: s.status,
            user: {
                id: s.user_id,
                username: s.username,
                avatar_url: s.avatar_url
            }
        }));
        res.json(formattedStreams);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/livestreams - Start a new stream
router.post('/', isAuthenticated, async (req, res) => {
    const { title } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO livestreams (user_id, title, status) VALUES (?, ?, ?)',
            [req.session.userId, title || 'Live Stream', 'live']
        );
        const [streamData] = await pool.query('SELECT * FROM livestreams WHERE id = ?', [result.insertId]);
        res.status(201).json(streamData[0]);
    } catch (error) {
         res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/livestreams/:id/end - End a stream
router.post('/:id/end', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE livestreams SET status = "ended" WHERE id = ? AND user_id = ?', [id, req.session.userId]);
        res.json({ message: 'Stream ended' });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
