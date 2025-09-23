import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/users - Get all users (for suggestions, search etc.)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, name, avatar_url, is_verified FROM users WHERE id != ? LIMIT 20', [req.session.userId]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/users/:id - Get a specific user's profile
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, name, avatar_url, bio, website, is_verified, is_private FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = users[0];

        // Get counts
        const [[counts]] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM posts WHERE user_id = ?) as post_count,
                (SELECT COUNT(*) FROM followers WHERE following_id = ?) as follower_count,
                (SELECT COUNT(*) FROM followers WHERE follower_id = ?) as following_count
        `, [user.id, user.id, user.id]);

        Object.assign(user, counts);
        
        // Get posts, reels, etc. (simplified for brevity)
        const [posts] = await pool.query('SELECT p.id, (SELECT media_url FROM post_media WHERE post_id = p.id ORDER BY sort_order ASC LIMIT 1) as media_url FROM posts p WHERE user_id = ? AND is_archived = 0 ORDER BY created_at DESC', [user.id]);
        user.posts = posts;

        res.json(user);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST /api/users/:id/follow - Follow/Unfollow a user
router.post('/:id/follow', isAuthenticated, async (req, res) => {
    const followingId = req.params.id;
    const followerId = req.session.userId;
    
    if (followingId === followerId) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        const [existingFollow] = await pool.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        
        if (existingFollow.length > 0) {
            // Unfollow
            await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
            res.json({ message: 'Unfollowed user.' });
        } else {
            // Follow
            await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
            res.json({ message: 'Followed user.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
