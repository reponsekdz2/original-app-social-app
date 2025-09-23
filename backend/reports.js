
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// POST /api/reports - Submit a new report
router.post('/', isAuthenticated, async (req, res) => {
    const { content, reason, details } = req.body;
    const reporter_id = req.session.userId;

    // The frontend sends a 'content' object which we need to parse
    const entity_type = 'username' in content ? 'user' : 'post'; // Simplified logic, could be reel too
    const entity_id = content.id;

    if (!entity_id || !entity_type || !reason) {
        return res.status(400).json({ message: 'Missing required report fields.' });
    }

    try {
        await pool.query(
            'INSERT INTO reports (reporter_id, reported_entity_id, entity_type, reason, details) VALUES (?, ?, ?, ?, ?)',
            [reporter_id, entity_id, entity_type, reason, details || null]
        );
        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;
