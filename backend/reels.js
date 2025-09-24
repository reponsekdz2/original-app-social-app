import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

const hydrateUserObject = (userRow) => ({
    id: userRow.id,
    username: userRow.username,
    name: userRow.name,
    avatar_url: userRow.avatar_url,
    isVerified: !!userRow.is_verified,
});

export default (upload) => {
    // GET /api/reels
    router.get('/', isAuthenticated, async (req, res) => {
        try {
            const [reels] = await pool.query(`
                SELECT 
                    r.id, r.caption, r.video_url, r.created_at as timestamp,
                    u.id as user_id, u.username, u.name, u.avatar_url, u.is_verified,
                    (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) as likes,
                    (SELECT COUNT(*) FROM comments WHERE reel_id = r.id) as comments_count
                FROM reels r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
                LIMIT 20;
            `);

            for (const reel of reels) {
                const [likedBy] = await pool.query('SELECT user_id FROM reel_likes WHERE reel_id = ?', [reel.id]);
                 // For simplicity, not fetching full comment objects here
                reel.comments = []; // Comments are fetched separately in the modal
                reel.likedBy = likedBy.map(l => ({ id: l.user_id }));
                reel.user = hydrateUserObject({ id: reel.user_id, ...reel });
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

    // POST /api/reels/:id/like
    router.post('/:id/like', isAuthenticated, async (req, res) => {
        const { id: reelId } = req.params;
        const userId = req.session.userId;
        try {
            const [[existingLike]] = await pool.query('SELECT * FROM reel_likes WHERE reel_id = ? AND user_id = ?', [reelId, userId]);
            if(existingLike) {
                await pool.query('DELETE FROM reel_likes WHERE reel_id = ? AND user_id = ?', [reelId, userId]);
            } else {
                await pool.query('INSERT INTO reel_likes (reel_id, user_id) VALUES (?, ?)', [reelId, userId]);
            }
            res.sendStatus(200);
        } catch (error) {
            console.error(`Error toggling like for reel ${reelId}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // POST /api/reels/:id/comments
    router.post('/:id/comments', isAuthenticated, async (req, res) => {
        const { id: reelId } = req.params;
        const { text } = req.body;
        try {
            const [result] = await pool.query('INSERT INTO comments (reel_id, user_id, text) VALUES (?, ?, ?)', [reelId, req.session.userId, text]);
            const [[commentData]] = await pool.query(`
                SELECT 
                    c.id, c.text, c.created_at as timestamp, 
                    u.*
                FROM comments c 
                JOIN users u ON c.user_id = u.id 
                WHERE c.id = ?
            `, [result.insertId]);

            const newComment = {
                id: commentData.id,
                text: commentData.text,
                timestamp: commentData.timestamp,
                user: hydrateUserObject(commentData)
            };
            
            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error adding comment to reel:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    return router;
};