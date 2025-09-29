--- START OF FILE backend/misc.js ---
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/misc/sponsored
router.get('/sponsored', isAuthenticated, async (req, res) => {
    const [ads] = await pool.query('SELECT * FROM sponsored_content');
    res.json(ads);
});

// GET /api/misc/trending
router.get('/trending', isAuthenticated, async (req, res) => {
    const [topics] = await pool.query('SELECT * FROM trending_topics ORDER BY post_count DESC LIMIT 10');
    res.json(topics);
});

// GET /api/misc/carousel
router.get('/carousel', async (req, res) => {
    const [images] = await pool.query('SELECT * FROM auth_carousel_images ORDER BY sort_order');
    res.json(images);
});

// GET /api/misc/stickers
router.get('/stickers', isAuthenticated, async (req, res) => {
    // In a real app, this would be dynamic. For now, we mock it.
    res.json([
        '/uploads/stickers/sticker1.webp',
        '/uploads/stickers/sticker2.webp',
        '/uploads/stickers/sticker3.webp',
    ]);
});

// GET /api/misc/announcements/active
router.get('/announcements/active', isAuthenticated, async (req, res) => {
    const [[announcement]] = await pool.query("SELECT * FROM announcements WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1");
    res.json(announcement || null);
});

// GET /api/misc/account-status
router.get('/account-status', isAuthenticated, async (req, res) => {
    const [[user]] = await pool.query('SELECT status FROM users WHERE id = ?', [req.session.userId]);
    const [warnings] = await pool.query('SELECT id, reason, created_at FROM user_warnings WHERE user_id = ? ORDER BY created_at DESC', [req.session.userId]);
    res.json({ status: user.status, warnings });
});


export default router;
--- END OF FILE backend/misc.js ---
