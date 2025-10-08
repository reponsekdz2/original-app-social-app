import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/misc/activity - This can be public for a logged in user
router.get('/activity', isAuthenticated, async (req, res) => {
    // This is a simplified feed activity. A real implementation would be more complex.
    const [activity] = await pool.query(`
        SELECT 'liked' as action, u.id as user_id, u.username, u.avatar_url, pl.post_id, pl.created_at as timestamp 
        FROM post_likes pl 
        JOIN users u ON pl.user_id = u.id 
        WHERE pl.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?)
        ORDER BY pl.created_at DESC LIMIT 5
    `, [req.session.userId]);
    res.json(activity);
});

// GET /api/misc/sponsored - This can be public for a logged in user
router.get('/sponsored', isAuthenticated, async (req, res) => {
    const [ads] = await pool.query('SELECT * FROM sponsored_content');
    res.json(ads);
});

// GET /api/misc/carousel - This is for the public auth page
router.get('/carousel', async (req, res) => {
    const [images] = await pool.query('SELECT * FROM auth_carousel_images ORDER BY sort_order');
    res.json(images);
});

// GET /api/misc/stickers - This can be public for a logged in user
router.get('/stickers', isAuthenticated, async (req, res) => {
    // In a real app, this would be dynamic. For now, we mock it.
    res.json([
        '/uploads/stickers/sticker1.webp',
        '/uploads/stickers/sticker2.webp',
        '/uploads/stickers/sticker3.webp',
    ]);
});

// GET /api/misc/announcements/active - This can be public for a logged in user
router.get('/announcements/active', isAuthenticated, async (req, res) => {
    const [[announcement]] = await pool.query("SELECT * FROM announcements WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1");
    res.json(announcement || null);
});

// GET /api/misc/account-status - This is user-specific
router.get('/account-status', isAuthenticated, async (req, res) => {
    const [[user]] = await pool.query('SELECT status FROM users WHERE id = ?', [req.session.userId]);
    const [warnings] = await pool.query('SELECT id, reason, created_at FROM user_warnings WHERE user_id = ? ORDER BY created_at DESC', [req.session.userId]);
    res.json({ status: user.status, warnings });
});


export default router;
