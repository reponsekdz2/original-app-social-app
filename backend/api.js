import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Get main feed for logged-in user (posts from users they follow)
// @route   GET /api/feed
// @access  Private
router.get('/feed', protect, async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.id, p.caption, p.location, p.created_at as timestamp,
                u.id as user_id, u.username, u.name, u.avatar_url as avatar, u.is_verified
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?)
            ORDER BY p.created_at DESC
            LIMIT 50
        `, [req.user.id]);
        
        // This is a simplified hydration. In a real app, this would be a more complex query or multiple queries.
        for (let post of posts) {
            post.user = { id: post.user_id, username: post.username, name: post.name, avatar: post.avatar, is_verified: post.is_verified };
            const [media] = await pool.query('SELECT media_url as url, media_type as type FROM post_media WHERE post_id = ?', [post.id]);
            post.media = media;
            const [likes] = await pool.query('SELECT user_id FROM post_likes WHERE post_id = ?', [post.id]);
            post.likes = likes.length;
        }

        res.json({ posts, stories: [] }); // Stories would be fetched similarly
    } catch(error) {
        console.error("Feed error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Get explore feed (random posts)
// @route   GET /api/explore
// @access  Public
router.get('/explore', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.id, 
                (SELECT media_url FROM post_media WHERE post_id = p.id ORDER BY position LIMIT 1) as media_url,
                (SELECT media_type FROM post_media WHERE post_id = p.id ORDER BY position LIMIT 1) as media_type
            FROM posts p 
            WHERE is_archived = FALSE
            ORDER BY RAND() 
            LIMIT 30
        `);
        res.json(posts);
    } catch(error) {
        console.error("Explore error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
