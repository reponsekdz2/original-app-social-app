import { Router } from 'express';
import db, { generateId } from './data.js';

const router = Router();

// Create a new support ticket
router.post('/support-tickets', (req, res) => {
    const { userId, subject, description } = req.body;
    if (!userId || !subject || !description) {
        return res.status(400).json({ message: 'User, subject, and description are required.' });
    }

    const newTicket = {
        id: generateId('ticket'),
        subject,
        description, // In a real app, you'd store the user ID
        lastUpdated: new Date().toLocaleDateString(),
        status: 'Open',
    };
    db.supportTickets.unshift(newTicket);
    
    // In a real app, you might notify an admin dashboard.
    
    res.status(201).json(newTicket);
});

// Submit a new report
router.post('/reports', (req, res) => {
    const { reporterId, reportedContentId, reason } = req.body;
    if (!reporterId || !reportedContentId || !reason) {
        return res.status(400).json({ message: 'Reporter, content ID, and reason are required.' });
    }

    const newReport = {
        id: generateId('report'),
        reporterId,
        reportedContentId,
        reason,
        status: 'Pending',
        timestamp: new Date().toISOString(),
    };
    db.reports.push(newReport);
    
    console.log(`New report submitted by ${reporterId} for content ${reportedContentId} due to: ${reason}`);
    
    res.status(201).json({ message: 'Report submitted successfully. Thank you for helping keep our community safe.' });
});

export default router;