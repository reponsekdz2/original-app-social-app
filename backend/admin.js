
import { Router } from 'express';
import pool from './db.js';
import { protect, adminProtect } from './middleware/authMiddleware.js';

const router = Router();

// All routes in this file are protected and require admin privileges
router.use(protect, adminProtect);

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [posts] = await pool.query('SELECT COUNT(*) as count FROM posts');
        const [reels] = await pool.query('SELECT COUNT(*) as count FROM reels');
        const [reports] = await pool.query("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
        const [live] = await pool.query("SELECT COUNT(*) as count FROM live_streams WHERE status = 'live'");

        res.json({
            totalUsers: users[0].count,
            totalPosts: posts[0].count,
            totalReels: reels[0].count,
            pendingReports: reports[0].count,
            liveStreams: live[0].count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user growth analytics
// @route   GET /api/admin/analytics/user-growth
// @access  Admin
router.get('/analytics/user-growth', async (req, res) => {
    try {
        const [data] = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(id) as count 
            FROM users 
            WHERE created_at >= CURDATE() - INTERVAL 30 DAY 
            GROUP BY DATE(created_at) 
            ORDER BY date ASC
        `);
        const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const values = data.map(d => d.count);
        res.json({ labels, values });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, email, created_at, is_admin, is_verified, avatar_url as avatar FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a user's status
// @route   PUT /api/admin/users/:id
// @access  Admin
router.put('/users/:id', async (req, res) => {
    const { is_admin, is_verified } = req.body;
    try {
        await pool.query(
            'UPDATE users SET is_admin = ?, is_verified = ? WHERE id = ?',
            [is_admin, is_verified, req.params.id]
        );
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
router.delete('/users/:id', async (req, res) => {
    try {
        // You might want to add more logic here (e.g., reassigning content or soft deleting)
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Admin
router.get('/reports', async (req, res) => {
    try {
        const [reports] = await pool.query(`
            SELECT r.*, ru.username as reporter_username, reported_u.username as reported_username, p.caption as reported_post_caption
            FROM reports r
            JOIN users ru ON r.reporter_id = ru.id
            LEFT JOIN users reported_u ON r.reported_entity_id = reported_u.id AND r.entity_type = 'user'
            LEFT JOIN posts p ON r.reported_entity_id = p.id AND r.entity_type = 'post'
            ORDER BY r.created_at DESC
        `);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a report's status
// @route   PUT /api/admin/reports/:id
// @access  Admin
router.put('/reports/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE reports SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Report status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Get all support tickets
// @route   GET /api/admin/support-tickets
// @access  Admin
router.get('/support-tickets', async (req, res) => {
    try {
        const [tickets] = await pool.query(`
            SELECT st.*, u.username as user_username
            FROM support_tickets st
            JOIN users u ON st.user_id = u.id
            ORDER BY st.updated_at DESC
        `);
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get a single support ticket with replies
// @route   GET /api/admin/support-tickets/:id
// @access  Admin
router.get('/support-tickets/:id', async (req, res) => {
    try {
        const [tickets] = await pool.query('SELECT * FROM support_tickets WHERE id = ?', [req.params.id]);
        if (tickets.length === 0) return res.status(404).json({ message: 'Ticket not found' });
        
        const [replies] = await pool.query(`
            SELECT ar.*, u.username as admin_username
            FROM admin_replies ar
            JOIN users u ON ar.admin_id = u.id
            WHERE ar.ticket_id = ? ORDER BY ar.created_at ASC
        `, [req.params.id]);

        res.json({ ...tickets[0], replies });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Reply to a support ticket
// @route   POST /api/admin/support-tickets/:id/reply
// @access  Admin
router.post('/support-tickets/:id/reply', async (req, res) => {
    const { message } = req.body;
    const adminId = req.user.id;
    const ticketId = req.params.id;
    try {
        await pool.query('INSERT INTO admin_replies (ticket_id, admin_id, message) VALUES (?, ?, ?)', [ticketId, adminId, message]);
        await pool.query("UPDATE support_tickets SET status = 'Pending' WHERE id = ?", [ticketId]); // Update status to pending admin reply
        res.status(201).json({ message: 'Reply sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all sponsored content
// @route   GET /api/admin/sponsored
// @access  Admin
router.get('/sponsored', async (req, res) => {
    try {
        const [content] = await pool.query('SELECT * FROM sponsored_content ORDER BY id DESC');
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create sponsored content
// @route   POST /api/admin/sponsored
// @access  Admin
router.post('/sponsored', async (req, res) => {
    const { company, logo_url, media_url, tagline, call_to_action, link } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO sponsored_content (company, logo_url, media_url, tagline, call_to_action, link) VALUES (?,?,?,?,?,?)', [company, logo_url, media_url, tagline, call_to_action, link]);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete sponsored content
// @route   DELETE /api/admin/sponsored/:id
// @access  Admin
router.delete('/sponsored/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM sponsored_content WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all trending topics
// @route   GET /api/admin/trending
// @access  Admin
router.get('/trending', async (req, res) => {
    try {
        const [topics] = await pool.query('SELECT * FROM trending_topics ORDER BY post_count DESC');
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a trending topic
// @route   POST /api/admin/trending
// @access  Admin
router.post('/trending', async (req, res) => {
    const { topic, post_count } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO trending_topics (topic, post_count) VALUES (?,?)', [topic, post_count]);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a trending topic
// @route   DELETE /api/admin/trending/:id
// @access  Admin
router.delete('/trending/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM trending_topics WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;
