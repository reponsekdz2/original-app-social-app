import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// GET /api/misc/sponsored
router.get('/sponsored', isAuthenticated, async (req, res) => {
    try {
        const [ads] = await pool.query('SELECT * FROM sponsored_content');
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /api/misc/trending
router.get('/trending', isAuthenticated, async (req, res) => {
    try {
        const [topics] = await pool.query('SELECT * FROM trending_topics ORDER BY post_count DESC LIMIT 5');
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// GET /api/misc/feed-activity - Placeholder
router.get('/feed-activity', isAuthenticated, (req, res) => {
    res.json([]); // This would be a complex query in a real app
});

// GET /api/misc/stickers
router.get('/stickers', isAuthenticated, async (req, res) => {
     try {
        const stickerDir = path.join(__dirname, 'uploads', 'stickers');
        const files = await fs.readdir(stickerDir);
        const stickerUrls = files.map(file => `/uploads/stickers/${file}`);
        res.json(stickerUrls);
    } catch (error) {
        console.error("Could not read stickers directory:", error);
        res.json([]);
    }
});

// GET /api/misc/carousel
router.get('/carousel', async (req, res) => {
    try {
        const [images] = await pool.query('SELECT * FROM auth_carousel_images ORDER BY sort_order ASC, id DESC');
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /api/misc/announcements/active
router.get('/announcements/active', isAuthenticated, async (req, res) => {
    try {
        const [[activeAnnouncement]] = await pool.query(
            'SELECT * FROM announcements WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1'
        );
        res.json(activeAnnouncement || null);
    } catch (error) {
         res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /api/misc/account-status
router.get('/account-status', isAuthenticated, async (req, res) => {
     try {
        const [[user]] = await pool.query('SELECT status FROM users WHERE id = ?', [req.session.userId]);
        // Mock warnings for now
        const warnings = [];
        if (user.status === 'suspended') {
            warnings.push({ id: 1, reason: 'Community guideline violation.', created_at: new Date().toISOString() });
        }
        res.json({ status: user.status, warnings });
    } catch (error) {
         res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
