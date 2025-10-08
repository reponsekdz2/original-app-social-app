import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();
const saltRounds = 10;

// GET /api/users/profile/:username
router.get('/profile/:username', isAuthenticated, async (req, res) => {
    const { username } = req.params;
    const currentUserId = req.session.userId;
    try {
        const [[user]] = await pool.query('SELECT id, username, name, avatar_url, bio, website, is_verified, is_private FROM users WHERE username = ?', [username]);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const [[{ isFollowing }]] = await pool.query('SELECT COUNT(*) > 0 as isFollowing FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, user.id]);

        const [[[counts]]] = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM posts p WHERE p.user_id = ? AND p.is_archived = 0) as post_count,
                (SELECT COUNT(*) FROM followers WHERE following_id = ?) as follower_count,
                (SELECT COUNT(*) FROM followers WHERE follower_id = ?) as following_count
        `, [user.id, user.id, user.id]);
        
        user.isFollowing = !!isFollowing;

        const canViewFullProfile = !user.is_private || user.isFollowing || user.id === currentUserId;

        if (canViewFullProfile) {
            const [posts] = await pool.query(`
                SELECT p.*, 
                       (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes,
                       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
                FROM posts p 
                WHERE (p.user_id = ? OR EXISTS (SELECT 1 FROM post_collaborators pc WHERE pc.post_id = p.id AND pc.user_id = ?))
                AND p.is_archived = 0 
                ORDER BY p.is_pinned DESC, p.created_at DESC
            `, [user.id, user.id]);

            for(const post of posts) {
                const [media] = await pool.query('SELECT id, media_url as url, media_type as type FROM post_media WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
                post.media = media;
                post.comments = []; // simplified for grid view
            }
            
            const [reels] = await pool.query(`
                SELECT r.*,
                       (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) as likes,
                       (SELECT COUNT(*) FROM comments WHERE reel_id = r.id) as comments_count
                FROM reels r WHERE user_id = ? ORDER BY created_at DESC
            `, [user.id]);

            const [highlights] = await pool.query('SELECT id, title, cover_image_url as cover FROM story_highlights WHERE user_id = ?', [user.id]);
            const [followers] = await pool.query('SELECT u.id, u.username, u.name, u.avatar_url, u.is_verified FROM users u JOIN followers f ON u.id = f.follower_id WHERE f.following_id = ?', [user.id]);
            const [following] = await pool.query('SELECT u.id, u.username, u.name, u.avatar_url, u.is_verified FROM users u JOIN followers f ON u.id = f.following_id WHERE f.follower_id = ?', [user.id]);

            user.posts = posts;
            user.reels = reels;
            user.highlights = highlights;
            user.followers = followers;
            user.following = following;
        }

        res.json({ ...user, ...counts });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /api/users/suggested
router.get('/suggested', isAuthenticated, async (req, res) => {
    const [users] = await pool.query(`
        SELECT id, username, name, avatar_url, is_verified 
        FROM users 
        WHERE id != ? AND id NOT IN (SELECT following_id FROM followers WHERE follower_id = ?) 
        ORDER BY RAND() LIMIT 10`, [req.session.userId, req.session.userId]);
    res.json(users);
});

// GET /api/users/all
router.get('/all', isAuthenticated, async (req, res) => {
    const [users] = await pool.query('SELECT id, username, name, avatar_url, is_verified FROM users');
    res.json(users);
});


// POST /api/users/:id/follow
router.post('/:id/follow', isAuthenticated, async (req, res) => {
    const { id: followingId } = req.params;
    const followerId = req.session.userId;
    try {
        await pool.query('INSERT IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
        await pool.query('INSERT INTO notifications (user_id, actor_id, type) VALUES (?, ?, "follow")', [followingId, followerId]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Could not follow user' });
    }
});

// POST /api/users/:id/unfollow
router.post('/:id/unfollow', isAuthenticated, async (req, res) => {
    const { id: followingId } = req.params;
    const followerId = req.session.userId;
    try {
        await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
        await pool.query('DELETE FROM notifications WHERE user_id = ? AND actor_id = ? AND type = "follow"', [followingId, followerId]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Could not unfollow user' });
    }
});

// PUT /api/users/profile
router.put('/profile', isAuthenticated, async (req, res) => {
    const { name, bio, website, gender } = req.body;
    try {
        await pool.query('UPDATE users SET name = ?, bio = ?, website = ?, gender = ? WHERE id = ?',
        [name, bio, website, gender, req.session.userId]);
        const [[user]] = await pool.query('SELECT id, username, name, avatar_url, bio, website, is_verified, is_private, gender FROM users WHERE id = ?', [req.session.userId]);
        res.json({ user });
    } catch (error) {
         res.status(500).json({ message: 'Could not update profile' });
    }
});

router.get('/close-friends', isAuthenticated, async (req, res) => {
    const [friends] = await pool.query(`
        SELECT u.id, u.username, u.name, u.avatar_url 
        FROM users u JOIN close_friends cf ON u.id = cf.friend_id 
        WHERE cf.user_id = ?`,
    [req.session.userId]);
    res.json(friends);
});

router.post('/close-friends', isAuthenticated, async (req, res) => {
    const { friendIds } = req.body;
    const userId = req.session.userId;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query('DELETE FROM close_friends WHERE user_id = ?', [userId]);
        if (friendIds && friendIds.length > 0) {
            const values = friendIds.map((friendId: string) => [userId, friendId]);
            await connection.query('INSERT INTO close_friends (user_id, friend_id) VALUES ?', [values]);
        }
        await connection.commit();
        res.sendStatus(200);
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Could not update close friends list.' });
    } finally {
        connection.release();
    }
});


// GET /api/users/stories/archived
router.get('/stories/archived', isAuthenticated, async (req, res) => {
    const [stories] = await pool.query(`
        SELECT si.id, si.media_url, si.media_type as mediaType 
        FROM story_items si 
        JOIN stories s ON si.story_id = s.id 
        WHERE s.user_id = ?`, 
    [req.session.userId]);
    res.json(stories);
});

// POST /api/users/highlights
router.post('/highlights', isAuthenticated, async (req, res) => {
    const { title, storyIds } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [[coverStory]] = await connection.query('SELECT media_url FROM story_items WHERE id = ?', [storyIds[0]]);
        const [result] = await connection.query(
            'INSERT INTO story_highlights (user_id, title, cover_image_url) VALUES (?, ?, ?)',
            [req.session.userId, title, coverStory.media_url]
        );
        const highlightId = result.insertId;
        const highlightItems = storyIds.map((storyId: string) => [highlightId, storyId]);
        await connection.query('INSERT INTO story_highlight_items (highlight_id, story_item_id) VALUES ?', [highlightItems]);
        await connection.commit();
        res.sendStatus(201);
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Could not create highlight' });
    } finally {
        connection.release();
    }
});

// POST /api/users/relationship
router.post('/relationship', isAuthenticated, async (req, res) => {
    const { targetUserId, action } = req.body; // action: 'block' | 'unblock' | 'mute' | 'unmute'
    const currentUserId = req.session.userId;
    const tableName = action.includes('block') ? 'blocked_users' : 'muted_users';
    const field1 = action.includes('block') ? 'blocker_id' : 'muter_id';
    const field2 = action.includes('block') ? 'blocked_id' : 'muted_id';

    try {
        if (action === 'block' || action === 'mute') {
            await pool.query(`INSERT INTO ${tableName} (${field1}, ${field2}) VALUES (?, ?)`, [currentUserId, targetUserId]);
        } else { // unblock or unmute
            await pool.query(`DELETE FROM ${tableName} WHERE ${field1} = ? AND ${field2} = ?`, [currentUserId, targetUserId]);
        }
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Action failed' });
    }
});

// GET /api/users/blocked
router.get('/blocked', isAuthenticated, async (req, res) => {
    const [users] = await pool.query(`
        SELECT u.id, u.username, u.name, u.avatar_url 
        FROM users u 
        JOIN blocked_users bu ON u.id = bu.blocked_id 
        WHERE bu.blocker_id = ?`,
    [req.session.userId]);
    res.json(users);
});

// GET /api/users/activity
router.get('/activity', isAuthenticated, async (req, res) => {
    const [activity] = await pool.query('SELECT * FROM login_activity WHERE user_id = ? ORDER BY login_time DESC LIMIT 10', [req.session.userId]);
    res.json(activity);
});

// PUT /api/users/password
router.put('/password', isAuthenticated, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const [[user]] = await pool.query('SELECT password FROM users WHERE id = ?', [req.session.userId]);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect old password.' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.session.userId]);
    res.sendStatus(200);
});

export default router;