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
        const [users] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
        const [posts] = await pool.query('SELECT COUNT(*) as totalPosts FROM posts');
        const [reels] = await pool.query('SELECT COUNT(*) as totalReels FROM reels');
        const [reports] = await pool.query("SELECT COUNT(*) as pendingReports FROM reports WHERE status = 'pending'");
        const [live] = await pool.query("SELECT COUNT(*) as liveStreams FROM live_streams WHERE status = 'live'");

        res.json({
            totalUsers: users[0].totalUsers,
            totalPosts: posts[0].totalPosts,
            totalReels: reels[0].totalReels,
            pendingReports: reports[0].pendingReports,
            liveStreams: live[0].liveStreams,
        });
    } catch (error) {
        console.error('Get Admin Stats Error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// @desc    Get user growth analytics data
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
        const result = {
            labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            values: data.map(d => d.count),
        };
        res.json(result);
    } catch (error) {
        console.error('Get User Growth Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get content trends analytics data
// @route   GET /api/admin/analytics/content-trends
// @access  Admin
router.get('/analytics/content-trends', async (req, res) => {
     try {
        const [data] = await pool.query(`
            SELECT date, SUM(posts) as posts, SUM(reels) as reels FROM (
                SELECT DATE(created_at) as date, COUNT(id) as posts, 0 as reels
                FROM posts
                WHERE created_at >= NOW() - INTERVAL 30 DAY
                GROUP BY date
                UNION ALL
                SELECT DATE(created_at) as date, 0 as posts, COUNT(id) as reels
                FROM reels
                WHERE created_at >= NOW() - INTERVAL 30 DAY
                GROUP BY date
            ) as combined
            GROUP BY date
            ORDER BY date ASC
        `);
        const result = {
            labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            postValues: data.map(d => d.posts),
            reelValues: data.map(d => d.reels),
        };
        res.json(result);
    } catch (error) {
        console.error('Get Content Trends Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, name, email, avatar_url, created_at, is_admin, is_verified FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Admin
router.put('/users/:id', async (req, res) => {
    const { is_admin, is_verified } = req.body;
    try {
        await pool.query('UPDATE users SET is_admin = ?, is_verified = ? WHERE id = ?', [is_admin, is_verified, req.params.id]);
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
router.delete('/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all content for moderation
// @route   GET /api/admin/content
// @access  Admin
router.get('/content', async (req, res) => {
    const { type } = req.query; // 'posts' or 'reels'
    try {
        if (type === 'posts') {
            const [posts] = await pool.query(`
                SELECT p.id, p.caption, p.created_at, u.username, 
                (SELECT pm.media_url FROM post_media pm WHERE pm.post_id = p.id LIMIT 1) as media_url
                FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC
            `);
            return res.json(posts);
        } else if (type === 'reels') {
            const [reels] = await pool.query(`
                SELECT r.id, r.caption, r.video_url as media_url, r.created_at, u.username
                FROM reels r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC
            `);
            return res.json(reels);
        }
        res.status(400).json({ message: 'Invalid content type' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete content
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
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Admin
router.get('/reports', async (req, res) => {
    try {
        const [reports] = await pool.query(`
            SELECT 
                r.id, r.reason, r.status, r.created_at, r.entity_type, r.reported_entity_id,
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
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update a report status
// @route   PUT /api/admin/reports/:id
// @access  Admin
router.put('/reports/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query("UPDATE reports SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ message: 'Report status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;