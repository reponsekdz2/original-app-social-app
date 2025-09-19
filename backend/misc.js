import { Router } from 'express';
import { protect } from './middleware/authMiddleware.js';
import pool from './db.js';

const router = Router();

// @desc    Get trending topics
// @route   GET /api/misc/trending
// @access  Private
router.get('/trending', protect, async (req, res) => {
    try {
        const [topics] = await pool.query('SELECT * FROM trending_topics ORDER BY post_count DESC LIMIT 10');
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get suggested users to follow
// @route   GET /api/misc/suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        // Simple suggestion: users that the current user doesn't follow yet, ordered by some metric (e.g., random).
        const [users] = await pool.query(`
            SELECT id, username, name, avatar_url as avatar, is_verified 
            FROM users 
            WHERE id != ? AND id NOT IN (SELECT following_id FROM followers WHERE follower_id = ?)
            ORDER BY RAND() LIMIT 5
        `, [userId, userId]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Get feed activity
// @route   GET /api/misc/feed-activity
// @access  Private
router.get('/feed-activity', protect, async (req, res) => {
    const userId = req.user.id;
    // This is a complex query. In a real app, this might be pre-calculated or stored differently.
    // For now, it gets recent likes and follows from people the user follows.
    try {
        const [activities] = await pool.query(`
            SELECT 
                'like' as type,
                pl.user_id as actor_id,
                u.username as actor_username,
                u.avatar_url as actor_avatar,
                p.id as entity_id,
                p.user_id as entity_owner_id,
                pu.username as entity_owner_username,
                (SELECT pm.media_url FROM post_media pm WHERE pm.post_id = p.id ORDER BY pm.sort_order ASC LIMIT 1) as entity_thumbnail,
                pl.created_at
            FROM post_likes pl
            JOIN users u ON pl.user_id = u.id
            JOIN posts p ON pl.post_id = p.id
            JOIN users pu ON p.user_id = pu.id
            WHERE pl.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) AND p.user_id != ?
            ORDER BY pl.created_at DESC
            LIMIT 10
        `, [userId, userId]);
        res.json(activities);
    } catch(error) {
        console.error("Feed Activity Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Get sponsored content
// @route   GET /api/misc/sponsored
// @access  Private
router.get('/sponsored', protect, async (req, res) => {
    try {
        const [ads] = await pool.query('SELECT * FROM sponsored_content ORDER BY RAND() LIMIT 2');
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get testimonials for premium page
// @route   GET /api/misc/testimonials
// @access  Private
router.get('/testimonials', protect, async (req, res) => {
    try {
        const [testimonials] = await pool.query(`
            SELECT t.quote, u.username, u.name, u.avatar_url as avatar, u.is_verified 
            FROM testimonials t 
            JOIN users u ON t.user_id = u.id 
            ORDER BY RAND() LIMIT 3
        `);
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get help articles
// @route   GET /api/misc/help-articles
// @access  Private
router.get('/help-articles', protect, async (req, res) => {
    // This could also be a DB table
    const articles = [
        { id: '1', title: 'How do I reset my password?', content: 'Go to Settings > Account > Change Password to update your security credentials.', category: 'Account Management' },
        { id: '2', title: 'How do I report a post?', content: 'Click the three dots on a post and select "Report" to notify our moderation team.', category: 'Safety and Security' },
    ];
    res.json(articles);
});


// @desc    Create a support ticket
// @route   POST /api/misc/support-tickets
// @access  Private
router.post('/support-tickets', protect, async (req, res) => {
    const { subject, description } = req.body;
    try {
        await pool.query('INSERT INTO support_tickets (user_id, subject, description) VALUES (?, ?, ?)', [req.user.id, subject, description]);
        res.status(201).json({ message: 'Support ticket created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user's support tickets
// @route   GET /api/misc/support-tickets
// @access  Private
router.get('/support-tickets', protect, async (req, res) => {
    try {
        const [tickets] = await pool.query('SELECT * FROM support_tickets WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id]);
        res.json(tickets);
    } catch(error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Create a report
// @route   POST /api/misc/reports
// @access  Private
router.post('/reports', protect, async (req, res) => {
    const { entityId, entityType, reason, details } = req.body;
    try {
        await pool.query(
            'INSERT INTO reports (reporter_id, reported_entity_id, entity_type, reason, details) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, entityId, entityType, reason, details]
        );
        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Subscribe to Premium
// @route   POST /api/misc/subscribe-premium
// @access  Private
router.post('/subscribe-premium', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        // In a real app, this would involve a payment gateway like Stripe.
        // Here, we just update the user's status.
        await pool.query('UPDATE users SET is_premium = TRUE, is_verified = TRUE WHERE id = ?', [userId]);
        res.json({ message: 'Successfully subscribed to Premium!' });
    } catch (error) {
        console.error('Premium Subscription Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;
