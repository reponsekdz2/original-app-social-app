import { Router } from 'express';
import pool from './db.js';
import { protect, adminProtect } from './middleware/authMiddleware.js';

const router = Router();

// All routes in this file are protected and require admin privileges
router.use(protect, adminProtect);

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [posts] = await pool.query('SELECT COUNT(*) as count FROM posts');
        const [reels] = await pool.query('SELECT COUNT(*) as count FROM reels');
        const [reports] = await pool.query("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
        const [liveStreams] = await pool.query("SELECT COUNT(*) as count FROM live_streams WHERE status = 'live'");

        res.json({
            totalUsers: users[0].count,
            totalPosts: posts[0].count,
            totalReels: reels[0].count,
            pendingReports: reports[0].count,
            liveStreams: liveStreams[0].count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Get user growth data for charts
// @route   GET /api/admin/analytics/user-growth
// @access  Admin
router.get('/analytics/user-growth', async (req, res) => {
    try {
        const [data] = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(id) as count 
            FROM users 
            WHERE created_at >= NOW() - INTERVAL 30 DAY 
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

// @desc    Get content trends data for charts
// @route   GET /api/admin/analytics/content-trends
// @access  Admin
router.get('/analytics/content-trends', async (req, res) => {
     try {
        const [posts] = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(id) as count 
            FROM posts 
            WHERE created_at >= NOW() - INTERVAL 30 DAY 
            GROUP BY DATE(created_at) 
            ORDER BY date ASC
        `);
         const [reels] = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(id) as count 
            FROM reels 
            WHERE created_at >= NOW() - INTERVAL 30 DAY 
            GROUP BY DATE(created_at) 
            ORDER BY date ASC
        `);
        
        // Combine and format data
        const dataMap = new Map();
        const labels = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            labels.push(label);
            dataMap.set(label, { posts: 0, reels: 0 });
        }
        posts.forEach(p => {
            const label = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if(dataMap.has(label)) dataMap.get(label).posts = p.count;
        });
        reels.forEach(r => {
            const label = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if(dataMap.has(label)) dataMap.get(label).reels = r.count;
        });

        const postValues = labels.map(l => dataMap.get(l).posts);
        const reelValues = labels.map(l => dataMap.get(l).reels);

        res.json({ labels, postValues, reelValues });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', async (req, res) => {
     try {
        const [users] = await pool.query('SELECT id, username, name, email, avatar_url as avatar, is_verified, is_admin, created_at, status FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a user's details (admin)
// @route   PUT /api/admin/users/:id
// @access  Admin
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { is_admin, is_verified, status } = req.body;
    try {
        let query = 'UPDATE users SET ';
        const params = [];
        const updates = [];
        
        if (is_admin !== undefined) {
            updates.push('is_admin = ?');
            params.push(is_admin);
        }
        if (is_verified !== undefined) {
            updates.push('is_verified = ?');
            params.push(is_verified);
        }
        if (status !== undefined && ['active', 'suspended', 'banned'].includes(status)) {
            updates.push('status = ?');
            params.push(status);
        }

        if (updates.length === 0) return res.status(400).json({ message: "No update fields provided." });

        query += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        await pool.query(query, params);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Issue a warning to a user
// @route   POST /api/admin/users/:id/warn
// @access  Admin
router.post('/users/:id/warn', async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;
    try {
        await pool.query(
            'INSERT INTO user_warnings (user_id, admin_user_id, reason) VALUES (?, ?, ?)',
            [id, adminId, reason]
        );
        res.status(201).json({ message: 'Warning issued successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Get content for moderation
// @route   GET /api/admin/content
// @access  Admin
router.get('/content', async (req, res) => {
    const { type } = req.query; // 'posts' or 'reels'
    try {
        if (type === 'posts') {
            const [posts] = await pool.query("SELECT p.id, u.username, p.caption, (SELECT pm.media_url FROM post_media pm WHERE pm.post_id = p.id ORDER BY pm.sort_order ASC LIMIT 1) as media_url FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 50");
            res.json(posts);
        } else if (type === 'reels') {
             const [reels] = await pool.query("SELECT r.id, u.username, r.caption, r.video_url as media_url FROM reels r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT 50");
            res.json(reels);
        } else {
            res.status(400).json({ message: 'Invalid content type' });
        }
    } catch (error) {
         res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete content (admin)
// @route   DELETE /api/admin/content/:type/:id
// @access  Admin
router.delete('/content/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    try {
        if (type === 'post') {
            await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        } else if (type === 'reel') {
            await pool.query('DELETE FROM reels WHERE id = ?', [id]);
        } else {
            return res.status(400).json({ message: 'Invalid content type' });
        }
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
            SELECT 
                r.id, r.entity_type, r.reason, r.status, r.created_at, r.reported_entity_id,
                reporter.username as reporter_username,
                reported_user.username as reported_username,
                reported_post.caption as reported_post_caption
            FROM reports r
            JOIN users reporter ON r.reporter_id = reporter.id
            LEFT JOIN users reported_user ON r.entity_type = 'user' AND r.reported_entity_id = reported_user.id
            LEFT JOIN posts reported_post ON r.entity_type = 'post' AND r.reported_entity_id = reported_post.id
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
    const { id } = req.params;
    const { status } = req.body;
     try {
        await pool.query("UPDATE reports SET status = ? WHERE id = ?", [status, id]);
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
            SELECT st.id, st.subject, st.status, st.created_at, u.username as user_username
            FROM support_tickets st
            JOIN users u ON st.user_id = u.id
            ORDER BY st.updated_at DESC
        `);
        res.json(tickets);
    } catch(error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get details of a single support ticket
// @route   GET /api/admin/support-tickets/:id
// @access  Admin
router.get('/support-tickets/:id', async (req, res) => {
    try {
        const [tickets] = await pool.query(`
            SELECT st.*, u.username as user_username FROM support_tickets st
            JOIN users u ON st.user_id = u.id
            WHERE st.id = ?
        `, [req.params.id]);

        if (tickets.length === 0) return res.status(404).json({ message: 'Ticket not found' });
        
        const [replies] = await pool.query('SELECT str.*, u.username as admin_username FROM support_ticket_replies str JOIN users u ON str.admin_user_id = u.id WHERE ticket_id = ? ORDER BY created_at ASC', [req.params.id]);
        
        const ticket = { ...tickets[0], replies };
        res.json(ticket);
    } catch(error) {
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
        await pool.query('INSERT INTO support_ticket_replies (ticket_id, admin_user_id, message) VALUES (?, ?, ?)', [ticketId, adminId, message]);
        await pool.query("UPDATE support_tickets SET status = 'Pending' WHERE id = ?", [ticketId]);
        res.status(201).json({ message: 'Reply sent' });
    } catch(error) {
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
        await pool.query(
            'INSERT INTO sponsored_content (company, logo_url, media_url, tagline, call_to_action, link) VALUES (?, ?, ?, ?, ?, ?)',
            [company, logo_url, media_url, tagline, call_to_action, link]
        );
        res.status(201).json({ message: 'Sponsored content created' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update sponsored content
// @route   PUT /api/admin/sponsored/:id
// @access  Admin
router.put('/sponsored/:id', async (req, res) => {
    const { id } = req.params;
    const { company, logo_url, media_url, tagline, call_to_action, link } = req.body;
    try {
        await pool.query(
            'UPDATE sponsored_content SET company = ?, logo_url = ?, media_url = ?, tagline = ?, call_to_action = ?, link = ? WHERE id = ?',
            [company, logo_url, media_url, tagline, call_to_action, link, id]
        );
        res.json({ message: 'Sponsored content updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete sponsored content
// @route   DELETE /api/admin/sponsored/:id
// @access  Admin
router.delete('/sponsored/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM sponsored_content WHERE id = ?', [id]);
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
        await pool.query('INSERT INTO trending_topics (topic, post_count) VALUES (?, ?)', [topic, post_count]);
        res.status(201).json({ message: 'Trending topic created' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a trending topic
// @route   DELETE /api/admin/trending/:id
// @access  Admin
router.delete('/trending/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM trending_topics WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all announcements
// @route   GET /api/admin/announcements
// @access  Admin
router.get('/announcements', async (req, res) => {
    try {
        const [announcements] = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(announcements);
    } catch(error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create an announcement
// @route   POST /api/admin/announcements
// @access  Admin
router.post('/announcements', async (req, res) => {
    const { title, content, type, is_active, expires_at } = req.body;
    try {
        await pool.query(
            'INSERT INTO announcements (title, content, type, is_active, expires_at) VALUES (?, ?, ?, ?, ?)',
            [title, content, type, is_active, expires_at || null]
        );
        res.status(201).json({ message: 'Announcement created' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update an announcement
// @route   PUT /api/admin/announcements/:id
// @access  Admin
router.put('/announcements/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, type, is_active, expires_at } = req.body;
    try {
        await pool.query(
            'UPDATE announcements SET title = ?, content = ?, type = ?, is_active = ?, expires_at = ? WHERE id = ?',
            [title, content, type, is_active, expires_at || null, id]
        );
        res.json({ message: 'Announcement updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete an announcement
// @route   DELETE /api/admin/announcements/:id
// @access  Admin
router.delete('/announcements/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM announcements WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all application settings
// @route   GET /api/admin/settings
// @access  Admin
router.get('/settings', async (req, res) => {
    try {
        const [settings] = await pool.query('SELECT * FROM app_settings');
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.setting_key] = curr.setting_value;
            return acc;
        }, {});
        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update application settings
// @route   PUT /api/admin/settings
// @access  Admin
router.put('/settings', async (req, res) => {
    const settings = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const updatePromises = Object.entries(settings).map(([key, value]) => {
            return connection.query(
                'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, value, value]
            );
        });
        await Promise.all(updatePromises);
        await connection.commit();
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Server Error' });
    } finally {
        connection.release();
    }
});


export default router;