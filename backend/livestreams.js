--- START OF FILE backend/livestreams.js ---
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/livestreams
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [streams] = await pool.query(`
            SELECT ls.id, ls.title, ls.started_at, u.id as user_id, u.username, u.name, u.avatar_url
            FROM livestreams ls
            JOIN users u ON ls.user_id = u.id
            WHERE ls.status = 'live'
            ORDER BY ls.started_at DESC
        `);

        const formattedStreams = streams.map(s => ({
            id: s.id,
            title: s.title,
            started_at: s.started_at,
            status: 'live',
            user: {
                id: s.user_id,
                username: s.username,
                name: s.name,
                avatar_url: s.avatar_url
            }
        }));
        res.json(formattedStreams);
    } catch (error) {
        console.error("Error fetching live streams:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// POST /api/livestreams
router.post('/', isAuthenticated, async (req, res) => {
    const { title } = req.body;
    const userId = req.session.userId;
    try {
        const [result] = await pool.query(
            'INSERT INTO livestreams (user_id, title) VALUES (?, ?)',
            [userId, title]
        );
        const [[stream]] = await pool.query('SELECT * FROM livestreams WHERE id = ?', [result.insertId]);
        res.status(201).json(stream);
    } catch (error) {
        console.error("Error starting live stream:", error);
        res.status(500).json({ message: "Failed to start live stream." });
    }
});

// PUT /api/livestreams/:id/end
router.put('/:id/end', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            "UPDATE livestreams SET status = 'ended' WHERE id = ? AND user_id = ?",
            [id, req.session.userId]
        );
        res.status(200).json({ message: 'Live stream ended.' });
    } catch (error) {
        console.error("Error ending live stream:", error);
        res.status(500).json({ message: "Failed to end live stream." });
    }
});

export default router;
--- END OF FILE backend/livestreams.js ---
