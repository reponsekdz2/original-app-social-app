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

// Fix: Add new endpoints with mock data
router.get('/stickers', (req, res) => {
    res.json([
        'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png',
        'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f923.png',
        'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f602.png',
    ]);
});

const mockUsers = [
    { id: 'user-3', username: 'naturelover', name: 'Alex Green', avatar: 'https://i.pravatar.cc/150?u=user-3', isVerified: false, followers: [], following: [] },
    { id: 'user-4', username: 'cityscape', name: 'Bella Ciao', avatar: 'https://i.pravatar.cc/150?u=user-4', isVerified: true, followers: [], following: [] },
    { id: 'user-5', username: 'foodfanatic', name: 'Charlie Chef', avatar: 'https://i.pravatar.cc/150?u=user-5', isVerified: false, followers: [], following: [] },
];

router.get('/trending', (req, res) => {
    res.json([
        { topic: '#ReactJS', postCount: 24500 },
        { topic: 'SummerVibes', postCount: 12300 },
        { topic: '#Tech', postCount: 9800 },
        { topic: '#DeveloperLife', postCount: 7650 },
        { topic: 'NetflixAndChill', postCount: 5400 },
    ]);
});

router.get('/suggestions', (req, res) => {
    res.json(mockUsers);
});

router.get('/feed-activity', (req, res) => {
    res.json([
        { id: 'act-1', user: mockUsers[0], action: 'liked', targetPost: { user: { name: 'SomeUser' } }, timestamp: '2h' },
        { id: 'act-2', user: mockUsers[1], action: 'followed', targetUser: { name: 'AnotherUser' }, timestamp: '3h' },
    ]);
});

router.get('/sponsored', (req, res) => {
    res.json([
        { id: 'ad-1', company: 'Cool Tech Inc.', logo: 'https://i.pravatar.cc/150?u=ad-1', media: 'https://i.pravatar.cc/150?u=ad-media-1', callToAction: 'Learn More', link: '#' }
    ]);
});

router.get('/conversations', (req, res) => {
    res.json([
        {
            id: 'convo-1',
            participants: [{ id: 'user-1' }, mockUsers[0]], // Assuming current user is 'user-1'
            messages: [{ id: 'msg-1', senderId: mockUsers[0].id, content: 'Hey, saw your latest post! Awesome shot.', timestamp: '10:30 AM', type: 'text', read: false, likedBy: [] }]
        },
        {
            id: 'convo-2',
            participants: [{ id: 'user-1' }, mockUsers[1]],
            messages: [{ id: 'msg-2', senderId: 'user-1', content: 'Thanks for the follow!', timestamp: 'Yesterday', type: 'text', read: true, likedBy: [] }]
        }
    ]);
});


export default router;
