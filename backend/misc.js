
import { Router } from 'express';
import pool from './db.js';

const router = Router();

// GET /api/misc/carousel
router.get('/carousel', async (req, res) => {
    try {
        const [images] = await pool.query('SELECT id, image_url, sort_order FROM auth_carousel_images ORDER BY sort_order ASC, id DESC');
        res.json(images);
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        res.status(500).json({ message: 'Error fetching carousel images from the database.' });
    }
});

export default router;
