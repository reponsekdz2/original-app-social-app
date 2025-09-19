import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Submit a support ticket
// @route   POST /api/misc/support-tickets
// @access  Private
router.post('/support-tickets', protect, async (req, res) => {
    const { subject, description } = req.body;
    const userId = req.user.id;
    if (!subject || !description) {
        return res.status(400).json({ message: 'Subject and description are required.' });
    }
    try {
        await pool.query(
            'INSERT INTO support_tickets (user_id, subject, description) VALUES (?, ?, ?)',
            [userId, subject, description]
        );
        res.status(201).json({ message: 'Support ticket created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// @desc    Submit a report
// @route   POST /api/misc/reports
// @access  Private
router.post('/reports', protect, async (req, res) => {
    const { contentId, contentType, reason } = req.body;
    const reporterId = req.user.id;
    if (!contentId || !contentType || !reason) {
        return res.status(400).json({ message: 'Content, type, and reason are required.' });
    }

    const reportData = {
        reporter_id: reporterId,
        reason: reason,
        reported_user_id: contentType === 'user' ? contentId : null,
        reported_post_id: contentType === 'post' ? contentId : null,
        reported_reel_id: contentType === 'reel' ? contentId : null,
        reported_comment_id: contentType === 'comment' ? contentId : null,
    };

    try {
        await pool.query('INSERT INTO reports SET ?', reportData);
        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// The following endpoints still use mock data but should be converted to use real DB queries
// in a full production system. For example, 'trending' could come from post tags,
// 'suggestions' from a recommendation algorithm, etc.

router.get('/stickers', (req, res) => {
    res.json([
        '/stickers/sticker1.png',
        '/stickers/sticker2.png',
        '/stickers/sticker3.png',
    ]);
});

router.get('/trending-topics', (req, res) => {
    res.json({
        topics: [
            { topic: '#TechTuesday', postCount: 12500 },
            { topic: 'ReactJS', postCount: 9800 },
            { topic: 'SummerVibes', postCount: 22300 },
        ]
    });
});

router.get('/feed-data', protect, async (req, res) => {
    // This is a complex query and for a large app should be optimized/cached
    // For now, it's a placeholder.
    res.json({
        feedActivities: [],
        trendingTopics: [
            { topic: '#TechTuesday', postCount: 12500 },
            { topic: 'ReactJS', postCount: 9800 },
        ],
        sponsoredContent: [
             {
                id: 'sp_1',
                company: 'CodeCademy',
                logo: '/sponsors/codecademy.png',
                media: '/sponsors/codecademy_ad.png',
                callToAction: 'Learn to code interactively.',
                link: 'https://codecademy.com'
            }
        ]
    });
});

router.get('/premium-data', (req, res) => {
    // Mock testimonials
    res.json({
        testimonials: [
            { id: 't1', user: { id: 'user-3', username: 'pro_dev', name: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=alex' }, quote: 'Going premium was the best decision for my brand!' },
            { id: 't2', user: { id: 'user-4', username: 'creative_cat', name: 'Mia Wallace', avatar: 'https://i.pravatar.cc/150?u=mia' }, quote: 'The AI tools are a game changer for content creation.' },
        ]
    });
});

router.get('/help-articles', (req, res) => {
    res.json({
        articles: [
            { id: 'h1', title: 'How to upload a 4K video?', content: 'Detailed steps...', category: 'Getting Started' },
            { id: 'h2', title: 'How does Magic Compose work?', content: 'Detailed steps...', category: 'Features' },
        ]
    });
});

export default router;
