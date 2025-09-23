import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

export default (upload) => {
    // GET /api/reels
    router.get('/', isAuthenticated, async (req, res) => {
        try {
            const [reels] = await pool.query(`
                SELECT 
                    r.id, r.caption, r.video_url, r.created_at as timestamp,
                    u.id as user_id, u.username, u.avatar_url,
                    (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) as likes,
                    (SELECT COUNT(*) FROM comments WHERE reel_id = r.id) as comments_count
                FROM reels r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
                LIMIT 20;
            `);

            for (const reel of reels) {
                 // For simplicity, not fetching full comment or like objects here
                reel.comments = [];
                reel.likedBy = [];
            }
            
            res.json(reels);
        } catch (error) {
            console.error('Error fetching reels:', error);
            res.status(500).json({ message: "Internal server error." });
        }
    });

    // POST /api/reels - Create new reel
    router.post('/', isAuthenticated, upload.single('video'), async (req, res) => {
        const { caption } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "A video file is required." });
        }

        const videoUrl = `/uploads/${file.filename}`;

        try {
            const [result] = await pool.query(
                'INSERT INTO reels (user_id, caption, video_url) VALUES (?, ?, ?)',
                [req.session.userId, caption, videoUrl]
            );

            res.status(201).json({ message: 'Reel created successfully', reelId: result.insertId });
        } catch (error) {
            console.error('Error creating reel:', error);
            res.status(500).json({ message: 'Failed to create reel.' });
        }
    });

    return router;
};
