import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// A reusable, optimized query for fetching posts
const POST_QUERY = `
    SELECT
        p.id,
        p.caption,
        p.location,
        p.is_archived,
        p.created_at as timestamp,
        JSON_OBJECT(
            'id', u.id,
            'username', u.username,
            'avatar', u.avatar_url,
            'is_verified', u.is_verified
        ) AS user,
        (SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', pm.id, 'url', pm.media_url, 'type', pm.media_type)
        ) FROM post_media pm WHERE pm.post_id = p.id) AS media,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count,
        (SELECT JSON_ARRAYAGG(
             JSON_OBJECT('id', c.id, 'text', c.text, 'timestamp', c.created_at, 'user', 
                JSON_OBJECT('id', cu.id, 'username', cu.username, 'avatar', cu.avatar_url)
             )
        ) FROM (SELECT * FROM comments WHERE post_id = p.id ORDER BY created_at DESC LIMIT 2) c JOIN users cu ON c.user_id = cu.id) AS comments,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) AS is_liked_by_user,
        EXISTS(SELECT 1 FROM post_saves WHERE post_id = p.id AND user_id = ?) AS is_saved_by_user
    FROM posts p
    JOIN users u ON p.user_id = u.id
`;


// @desc    Get main feed for the current user
// @route   GET /api/posts/feed
// @access  Private
router.get('/posts/feed', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [posts] = await pool.query(
            `${POST_QUERY} 
             WHERE p.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) OR p.user_id = ?
             AND p.is_archived = FALSE
             ORDER BY p.created_at DESC LIMIT 20`,
            [userId, userId, userId, userId]
        );
        res.json({ posts });
    } catch (error) {
        console.error('Get Feed Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get posts for the explore page
// @route   GET /api/posts/explore
// @access  Private
router.get('/posts/explore', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [posts] = await pool.query(
            `${POST_QUERY}
             WHERE p.is_archived = FALSE
             ORDER BY RAND() LIMIT 30`, // Simple randomization for explore
            [userId, userId]
        );
        res.json({ posts });
    } catch (error) {
        console.error('Get Explore Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Get stories for the user's feed
// @route   GET /api/stories/feed
// @access  Private
router.get('/stories/feed', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        // Get stories from users the current user follows + their own stories, created in the last 24 hours
        const [stories] = await pool.query(`
            SELECT 
                s.id,
                JSON_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar_url) as user,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('id', si.id, 'media', si.media_url, 'mediaType', si.media_type, 'duration', si.duration_ms)
                ) FROM story_items si WHERE si.story_id = s.id) as stories
            FROM stories s
            JOIN users u ON s.user_id = u.id
            WHERE (s.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) OR s.user_id = ?)
            AND s.created_at >= NOW() - INTERVAL 1 DAY
            GROUP BY s.id, u.id
            ORDER BY u.id = ? DESC, s.created_at DESC;
        `, [userId, userId, userId]);
        res.json({ stories });
    } catch (error) {
        console.error('Get Stories Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;
