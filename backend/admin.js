--- START OF FILE backend/admin.js ---
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const isAdmin = async (req, res, next) => {
    try {
        const [[user]] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [req.session.userId]);
        if (user && user.is_admin) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Administrator access required.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const router = Router();

export default (upload) => {
    router.use(isAuthenticated, isAdmin);

    // GET /api/admin/stats
    router.get('/stats', async (req, res) => {
        try {
            const [[[totalUsers]]] = await pool.query('SELECT COUNT(*) as count FROM users');
            const [[[newUsersToday]]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE created_at >= CURDATE()");
            const [[[totalPosts]]] = await pool.query('SELECT COUNT(*) as count FROM posts');
            const [[[totalReels]]] = await pool.query('SELECT COUNT(*) as count FROM reels');
            const [[[pendingReports]]] = await pool.query("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
            const [[[liveStreams]]] = await pool.query("SELECT COUNT(*) as count FROM livestreams WHERE status = 'live'");
            res.json({
                totalUsers: totalUsers.count,
                newUsersToday: newUsersToday.count,
                totalPosts: totalPosts.count,
                totalReels: totalReels.count,
                pendingReports: pendingReports.count,
                liveStreams: liveStreams.count
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stats' });
        }
    });
    
    // GET /api/admin/users
    router.get('/users', async (req, res) => {
        const [users] = await pool.query('SELECT id, username, email, name, wallet_balance, status, created_at FROM users');
        res.json(users);
    });

    // POST /api/admin/users/:id/warn
    router.post('/users/:id/warn', async (req, res) => {
        const { reason } = req.body;
        await pool.query('INSERT INTO user_warnings (user_id, reason, issued_by_admin_id) VALUES (?, ?, ?)', [req.params.id, reason, req.session.userId]);
        res.sendStatus(200);
    });

    // DELETE /api/admin/users/:id
    router.delete('/users/:id', async (req, res) => {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.sendStatus(200);
    });
    
    // GET /api/admin/posts
    router.get('/posts', async (req, res) => {
        const [posts] = await pool.query('SELECT p.id, p.caption, u.username FROM posts p JOIN users u ON p.user_id = u.id');
        res.json(posts);
    });
    
    // DELETE /api/admin/posts/:id
    router.delete('/posts/:id', async (req, res) => {
        await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.sendStatus(200);
    });
    
    // GET /api/admin/reels
    router.get('/reels', async (req, res) => {
        const [reels] = await pool.query('SELECT r.id, r.caption, u.username FROM reels r JOIN users u ON r.user_id = u.id');
        res.json(reels);
    });
    
     // DELETE /api/admin/reels/:id
    router.delete('/reels/:id', async (req, res) => {
        await pool.query('DELETE FROM reels WHERE id = ?', [req.params.id]);
        res.sendStatus(200);
    });
    
    // GET /api/admin/reports
    router.get('/reports', async (req, res) => {
        const [reports] = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
        res.json(reports);
    });
    
    // PUT /api/admin/reports/:id
    router.put('/reports/:id', async (req, res) => {
        const { status } = req.body;
        await pool.query('UPDATE reports SET status = ? WHERE id = ?', [status, req.params.id]);
        res.sendStatus(200);
    });

    // GET /api/admin/support/tickets
    router.get('/support/tickets', async (req, res) => {
        const [tickets] = await pool.query('SELECT st.*, u.username as user_username FROM support_tickets st JOIN users u ON st.user_id = u.id ORDER BY st.updated_at DESC');
        res.json(tickets);
    });

    // POST /api/admin/support/tickets/:id/reply
    router.post('/support/tickets/:id/reply', async (req, res) => {
        const { message } = req.body;
        const [reply] = await pool.query(
            'INSERT INTO support_ticket_replies (ticket_id, user_id, is_admin_reply, message) VALUES (?, ?, 1, ?)',
            [req.params.id, req.session.userId, message]
        );
        await pool.query('UPDATE support_tickets SET status = "Pending", updated_at = NOW() WHERE id = ?', [req.params.id]);
        res.status(201).json({ id: reply.insertId, message, created_at: new Date().toISOString() });
    });

    // GET /api/admin/sponsored
    router.get('/sponsored', async (req, res) => {
        const [ads] = await pool.query('SELECT * FROM sponsored_content');
        res.json(ads);
    });

    // POST /api/admin/sponsored
    router.post('/sponsored', async (req, res) => {
        const { company, logo_url, media_url, tagline, call_to_action, link } = req.body;
        const [result] = await pool.query('INSERT INTO sponsored_content (company, logo_url, media_url, tagline, call_to_action, link) VALUES (?, ?, ?, ?, ?, ?)', [company, logo_url, media_url, tagline, call_to_action, link]);
        res.status(201).json({ id: result.insertId, ...req.body });
    });

    // DELETE /api/admin/sponsored/:id
    router.delete('/sponsored/:id', async (req, res) => {
        await pool.query('DELETE FROM sponsored_content WHERE id = ?', [req.params.id]);
        res.sendStatus(200);
    });
    
    // GET /api/admin/trending
    router.get('/trending', async (req, res) => {
        const [topics] = await pool.query('SELECT * FROM trending_topics');
        res.json(topics);
    });

    // POST /api/admin/trending
    router.post('/trending', async (req, res) => {
        const { topic } = req.body;
        const [result] = await pool.query('INSERT INTO trending_topics (topic) VALUES (?)', [topic]);
        res.status(201).json({ id: result.insertId, topic, post_count: 0 });
    });

    // DELETE /api/admin/trending/:id
    router.delete('/trending/:id', async (req, res) => {
        await pool.query('DELETE FROM trending_topics WHERE id = ?', [req.params.id]);
        res.sendStatus(200);
    });

    // POST /api/admin/carousel
    router.post('/carousel', upload.single('image'), async (req, res) => {
        const imageUrl = `/uploads/carousel/${req.file.filename}`;
        const [result] = await pool.query('INSERT INTO auth_carousel_images (image_url) VALUES (?)', [imageUrl]);
        res.status(201).json({ id: result.insertId, image_url: imageUrl });
    });

    // DELETE /api/admin/carousel/:id
    router.delete('/carousel/:id', async (req, res) => {
        // You might want to also delete the file from the filesystem here
        await pool.query('DELETE FROM auth_carousel_images WHERE id = ?', [req.params.id]);
        res.sendStatus(200);
    });
    
    // GET /api/admin/announcements
    router.get('/announcements', async (req, res) => {
        const [announcements] = await pool.query('SELECT * FROM announcements');
        res.json(announcements);
    });

    // POST /api/admin/announcements
    router.post('/announcements', async (req, res) => {
        const { title, content, type, is_active } = req.body;
        const [result] = await pool.query('INSERT INTO announcements (title, content, type, is_active) VALUES (?, ?, ?, ?)', [title, content, type, is_active]);
        res.status(201).json({ id: result.insertId, ...req.body });
    });

    // PUT /api/admin/announcements/:id
    router.put('/announcements/:id', async (req, res) => {
        const { title, content, type, is_active } = req.body;
        await pool.query('UPDATE announcements SET title = ?, content = ?, type = ?, is_active = ? WHERE id = ?', [title, content, type, is_active, req.params.id]);
        res.sendStatus(200);
    });

    // DELETE /api/admin/announcements/:id
    router.delete('/announcements/:id', async (req, res) => {
        await pool.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
        res.sendStatus(200);
    });
    
    // GET /api/admin/settings
    router.get('/settings', async (req, res) => {
        const [settings] = await pool.query('SELECT * FROM app_settings');
        const settingsObj = settings.reduce((acc, { setting_key, setting_value }) => {
            acc[setting_key] = setting_value === 'true'; // Convert to boolean
            return acc;
        }, {});
        res.json(settingsObj);
    });

    // PUT /api/admin/settings
    router.put('/settings', async (req, res) => {
        const settings = req.body;
        for (const [key, value] of Object.entries(settings)) {
            await pool.query('INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', [key, String(value), String(value)]);
        }
        res.sendStatus(200);
    });

    return router;
};
--- END OF FILE backend/admin.js ---
