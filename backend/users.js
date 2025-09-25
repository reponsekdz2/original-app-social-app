import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

// GET /api/users - Get all users (for search/tagging)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, name, avatar_url, is_verified FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/users/suggestions
router.get('/suggestions', isAuthenticated, async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT id, username, name, avatar_url, is_verified 
            FROM users 
            WHERE id != ? AND id NOT IN (SELECT following_id FROM followers WHERE follower_id = ?)
            ORDER BY RAND()
            LIMIT 10
        `, [req.session.userId, req.session.userId]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


// GET /api/users/:username - Get a specific user's profile
router.get('/:username', isAuthenticated, async (req, res) => {
    try {
        const [[user]] = await pool.query('SELECT * FROM users WHERE username = ?', [req.params.username]);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const [[counts]] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM posts WHERE user_id = ? AND is_archived = 0) as post_count,
                (SELECT COUNT(*) FROM followers WHERE following_id = ?) as follower_count,
                (SELECT COUNT(*) FROM followers WHERE follower_id = ?) as following_count
        `, [user.id, user.id, user.id]);

        user.post_count = counts.post_count;
        user.follower_count = counts.follower_count;
        user.following_count = counts.following_count;
        
        const [followers] = await pool.query('SELECT follower_id FROM followers WHERE following_id = ?', [user.id]);
        const [following] = await pool.query('SELECT following_id FROM followers WHERE follower_id = ?', [user.id]);
        user.followers = followers.map(f => ({ id: f.follower_id }));
        user.following = following.map(f => ({ id: f.following_id }));

        // In a real app, you'd check for privacy settings before returning posts
        const [posts] = await pool.query('SELECT id, (SELECT media_url FROM post_media WHERE post_id = p.id LIMIT 1) as media_url, (SELECT media_type FROM post_media WHERE post_id = p.id LIMIT 1) as media_type FROM posts p WHERE user_id = ? AND is_archived = 0', [user.id]);
        const [reels] = await pool.query('SELECT id, video_url FROM reels WHERE user_id = ?', [user.id]);
        
        user.posts = posts.map(p => ({ id: p.id, media: [{ url: p.media_url, type: p.media_type }]}));
        user.reels = reels;

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/users/:id/follow
router.post('/:id/follow', isAuthenticated, async (req, res) => {
    const followerId = req.session.userId;
    const followingId = req.params.id;

    if (followerId === followingId) return res.status(400).json({ message: "Cannot follow yourself." });

    try {
        await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
        res.sendStatus(200);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(200).json({ message: "Already following." });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/users/:id/unfollow
router.post('/:id/unfollow', isAuthenticated, async (req, res) => {
    const followerId = req.session.userId;
    const followingId = req.params.id;

    try {
        await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// PUT /api/users/me - Update current user profile
router.put('/me', isAuthenticated, async (req, res) => {
    const { name, bio, website, gender } = req.body;
    try {
        await pool.query(
            'UPDATE users SET name = ?, bio = ?, website = ?, gender = ? WHERE id = ?',
            [name, bio, website, gender, req.session.userId]
        );
        const [[updatedUser]] = await pool.query('SELECT id, username, name, avatar_url, bio, website, gender FROM users WHERE id = ?', [req.session.userId]);
        res.json(updatedUser);
    } catch(error) {
         res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/users/me/stories/archived
router.get('/me/stories/archived', isAuthenticated, async (req, res) => {
    try {
        const [stories] = await pool.query(
            `SELECT si.id, si.media_url, si.media_type as mediaType 
             FROM story_items si 
             JOIN stories s ON si.story_id = s.id 
             WHERE s.user_id = ? ORDER BY s.created_at DESC`, 
             [req.session.userId]
        );
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/users/me/highlights
router.post('/me/highlights', isAuthenticated, async (req, res) => {
    const { title, storyIds } = req.body;
    if (!title || !storyIds || storyIds.length === 0) {
        return res.status(400).json({ message: "Title and at least one story are required." });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [[firstStoryItem]] = await connection.query('SELECT media_url FROM story_items WHERE id = ?', [storyIds[0]]);
        
        const [result] = await connection.query(
            'INSERT INTO story_highlights (user_id, title, cover_image_url) VALUES (?, ?, ?)',
            [req.session.userId, title, firstStoryItem.media_url]
        );
        const highlightId = result.insertId;

        const highlightItems = storyIds.map(storyId => [highlightId, storyId]);
        await connection.query('INSERT INTO story_highlight_items (highlight_id, story_item_id) VALUES ?', [highlightItems]);
        
        await connection.commit();
        res.sendStatus(201);
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Internal server error" });
    } finally {
        connection.release();
    }
});

// POST /api/users/:id/block
router.post('/:id/block', isAuthenticated, async (req, res) => {
    await pool.query('INSERT IGNORE INTO blocked_users (user_id, blocked_user_id) VALUES (?, ?)', [req.session.userId, req.params.id]);
    res.sendStatus(200);
});

// POST /api/users/:id/unblock
router.post('/:id/unblock', isAuthenticated, async (req, res) => {
    await pool.query('DELETE FROM blocked_users WHERE user_id = ? AND blocked_user_id = ?', [req.session.userId, req.params.id]);
    res.sendStatus(200);
});

// POST /api/users/:id/mute
router.post('/:id/mute', isAuthenticated, async (req, res) => {
    await pool.query('INSERT IGNORE INTO muted_users (user_id, muted_user_id) VALUES (?, ?)', [req.session.userId, req.params.id]);
    res.sendStatus(200);
});

// POST /api/users/:id/unmute
router.post('/:id/unmute', isAuthenticated, async (req, res) => {
    await pool.query('DELETE FROM muted_users WHERE user_id = ? AND muted_user_id = ?', [req.session.userId, req.params.id]);
    res.sendStatus(200);
});

export default router;