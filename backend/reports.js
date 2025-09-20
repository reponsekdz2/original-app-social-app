import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Submit a new report
// @route   POST /api/reports
// @access  Private
router.post('/', protect, async (req, res) => {
    const { entityId, entityType, reason, details } = req.body;
    const reporterId = req.user.id;

    if (!entityId || !entityType || !reason) {
        return res.status(400).json({ message: 'Entity ID, type, and reason are required.' });
    }

    try {
        await pool.query(
            'INSERT INTO reports (reporter_id, reported_entity_id, entity_type, reason, details) VALUES (?, ?, ?, ?, ?)',
            [reporterId, entityId, entityType, reason, details || null]
        );
        res.status(201).json({ message: 'Report submitted successfully. Thank you for helping keep our community safe.' });
    } catch (error) {
        console.error("Submit Report Error:", error);
        res.status(500).json({ message: 'Server error while submitting report.' });
    }
});

export default router;
