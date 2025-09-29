import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();
const REELS_PER_PAGE = 5;

export default (upload) => {
    router.get('/', isAuthenticated, async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * REELS_PER_PAGE;
        try {
            const [reels] = await pool.query(`
                SELECT r.*, u.username, u.avatar_url 
                FROM reels r 
                JOIN users u ON r.user_id = u.id 
                ORDER BY r.created_at DESC
                LIMIT ? OFFSET ?
            `, [REELS_PER_PAGE, offset]);
            
            for (const reel of reels) {
                 const [likes] = await pool.query('SELECT user_id FROM reel_likes WHERE reel_id = ?', [reel.id]);
                 const [comments] = await pool.query('SELECT id FROM comments WHERE reel_id = ?', [reel.id]);
                 reel.likes = likes.length;
                 reel.likedBy = likes.map(l => ({ id: l.user_id }));
                 reel.comments = comments; // Just need the count for the main view
                 reel.user = { id: reel.user_id, username: reel.username, avatar_url: reel.avatar_url };
            }
            res.json(reels);
        } catch (error) {
            console.error("Error fetching reels:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
    
    router.post('/', isAuthenticated, upload.single('video'), async (req, res) => {
        const { caption } = req.body;
        const file = req.file;
        const userId = req.session.userId;

        if (!file) {
            return res.status(400).json({ message: 'Video file is required.' });
        }

        try {
            const videoUrl = `/uploads/${file.filename}`;
            const [result] = await pool.query(
                'INSERT INTO reels (user_id, video_url, caption) VALUES (?, ?, ?)',
                [userId, videoUrl, caption]
            );
            
            const [[user]] = await pool.query('SELECT username, avatar_url FROM users WHERE id = ?', [userId]);
            const newReel = {
                id: result.insertId,
                user_id: userId,
                video_url: videoUrl,
                caption,
                created_at: new Date().toISOString(),
                likes: 0,
                likedBy: [],
                comments: [],
                shares: 0,
                user: {
                    id: userId,
                    username: user.username,
                    avatar_url: user.avatar_url
                }
            };
            res.status(201).json(newReel);
        } catch (error) {
            console.error("Error creating reel:", error);
            res.status(500).json({ message: "Failed to create reel." });
        }
    });
    
    router.post('/:id/comment', isAuthenticated, async (req, res) => {
        const { id: reelId } = req.params;
        const { text } = req.body;
        const userId = req.session.userId;

        try {
            const [result] = await pool.query(
                'INSERT INTO comments (reel_id, user_id, text) VALUES (?, ?, ?)',
                [reelId, userId, text]
            );
            const [[newComment]] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
            res.status(201).json(newComment);
        } catch (error) {
            console.error("Error commenting on reel:", error);
            res.status(500).json({ message: "Failed to comment." });
        }
    });

    return router;
};
