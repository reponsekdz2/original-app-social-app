import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/calls/history
router.get('/history', isAuthenticated, async (req, res) => {
    try {
        const [calls] = await pool.query(`
            SELECT 
                ch.id, ch.type, ch.status, ch.started_at, ch.duration_seconds,
                IF(ch.caller_id = ?, r.id, c.id) as other_user_id,
                IF(ch.caller_id = ?, r.username, c.username) as other_user_username,
                IF(ch.caller_id = ?, r.avatar_url, c.avatar_url) as other_user_avatar_url,
                (ch.caller_id = ?) as was_outgoing
            FROM call_history ch
            JOIN users c ON ch.caller_id = c.id
            JOIN users r ON ch.receiver_id = r.id
            WHERE ch.caller_id = ? OR ch.receiver_id = ?
            ORDER BY ch.started_at DESC
        `, [req.session.userId, req.session.userId, req.session.userId, req.session.userId, req.session.userId, req.session.userId]);

        res.json(calls);
    } catch (error) {
        console.error("Error fetching call history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/calls/log
router.post('/log', isAuthenticated, async (req, res) => {
    const { receiverId, type, status, duration } = req.body;
    const callerId = req.session.userId;
    try {
        const [result] = await pool.query(
            'INSERT INTO call_history (caller_id, receiver_id, type, status, duration_seconds, started_at, ended_at) VALUES (?, ?, ?, ?, ?, NOW() - INTERVAL ? SECOND, NOW())',
            [callerId, receiverId, type, status, duration, duration]
        );
        res.status(201).json({ callId: result.insertId });
    } catch (error) {
        console.error("Error logging call:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;