import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const [users] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [req.session.userId]);
        if (users.length > 0 && users[0].is_admin) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: Admins only." });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error during admin check.' });
    }
};

export default (upload) => {
    const router = Router();
    // All routes in this file are protected by isAdmin
    router.use(isAdmin);

    // GET /api/admin/stats
    router.get('/stats', async (req, res) => {
        try {
            const [[userStats]] = await pool.query(`
                SELECT
                    (SELECT COUNT(*) FROM users) as totalUsers,
                    (SELECT COUNT(*) FROM users WHERE created_at >= CURDATE()) as newUsersToday
            `);
            const [[contentStats]] = await pool.query(`
                SELECT
                    (SELECT COUNT(*) FROM posts) as totalPosts,
                    (SELECT COUNT(*) FROM reels) as totalReels
            `);
             const [[reportStats]] = await pool.query(`
                SELECT COUNT(*) as pendingReports FROM reports WHERE status = 'pending'
            `);
             const [[liveStreams]] = await pool.query(`
                SELECT COUNT(*) as liveStreams FROM livestreams WHERE status = 'live'
            `);

            res.json({ ...userStats, ...contentStats, ...reportStats, ...liveStreams });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stats' });
        }
    });
    
    // GET /api/admin/users
    router.get('/users', async (req, res) => {
        const searchTerm = req.query.search || '';
        try {
            const [users] = await pool.query(
                `SELECT id, username, email, avatar_url, last_login, status, is_admin, is_verified, wallet_balance 
                 FROM users 
                 WHERE username LIKE ? OR email LIKE ?`,
                [`%${searchTerm}%`, `%${searchTerm}%`]
            );
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users' });
        }
    });

    // PUT /api/admin/users/:id
    router.put('/users/:id', async (req, res) => {
        const { id } = req.params;
        const { status, is_admin, is_verified } = req.body;
        try {
            const fields = [];
            const values = [];
            if(status) { fields.push('status = ?'); values.push(status); }
            if(is_admin !== undefined) { fields.push('is_admin = ?'); values.push(is_admin); }
            if(is_verified !== undefined) { fields.push('is_verified = ?'); values.push(is_verified); }

            if(fields.length === 0) return res.status(400).json({ message: "No update fields provided." });

            values.push(id);
            await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
            res.sendStatus(200);
        } catch (error) {
             res.status(500).json({ message: 'Error updating user' });
        }
    });

    // DELETE /api/admin/users/:id
    router.delete('/users/:id', async (req, res) => {
        try {
            await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user' });
        }
    });
    
    // GET /api/admin/reports
    router.get('/reports', async (req, res) => {
        try {
            const [reports] = await pool.query('SELECT r.*, u_reporter.username as reporter_username FROM reports r JOIN users u_reporter ON r.reporter_id = u_reporter.id ORDER BY r.created_at DESC');
            res.json(reports);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching reports' });
        }
    });

    // PUT /api/admin/reports/:id
    router.put('/reports/:id', async (req, res) => {
        const { status } = req.body;
        try {
            await pool.query('UPDATE reports SET status = ? WHERE id = ?', [status, req.params.id]);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: 'Error updating report' });
        }
    });
    
    // GET /api/admin/carousel
    router.get('/carousel', async (req, res) => {
        try {
            const [images] = await pool.query('SELECT * FROM auth_carousel_images ORDER BY sort_order ASC, id DESC');
            res.json(images);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching carousel images' });
        }
    });

    // POST /api/admin/carousel
    router.post('/carousel', upload.single('image'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }
        const imageUrl = `/uploads/carousel/${req.file.filename}`;
        try {
            await pool.query('INSERT INTO auth_carousel_images (image_url) VALUES (?)', [imageUrl]);
            res.status(201).json({ message: 'Image uploaded successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error saving image to database.' });
        }
    });

    // DELETE /api/admin/carousel/:id
    router.delete('/carousel/:id', async (req, res) => {
        try {
            await pool.query('DELETE FROM auth_carousel_images WHERE id = ?', [req.params.id]);
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting image.' });
        }
    });

    return router;
};