--- START OF FILE backend/reports.js ---
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// POST /api/reports
router.post('/', isAuthenticated, async (req, res) => {
    const { reported_entity_id, entity_type, reason, details } = req.body;
    const reporter_id = req.session.userId;

    if (!reported_entity_id || !entity_type || !reason) {
        return res.status(400).json({ message: 'Missing required report information.' });
    }

    try {
        await pool.query(
            'INSERT INTO reports (reporter_id, reported_entity_id, entity_type, reason, details) VALUES (?, ?, ?, ?, ?)',
            [reporter_id, reported_entity_id, entity_type, reason, details || null]
        );
        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Failed to submit report.' });
    }
});

export default router;
--- END OF FILE backend/reports.js ---
