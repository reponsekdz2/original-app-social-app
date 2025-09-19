import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { getSocketFromUserId } from './socket.js';

const router = Router();

// --- Multer Setup ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `post-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

const POST_QUERY = `
    SELECT
        p.id, p.caption, p.location, p.is_archived, p.created_at as timestamp,
        JSON_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar_url, 'is_verified', u.is_verified) AS user,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pm.id, 'url', pm.media_url, 'type', pm.media_type)) FROM post_media pm WHERE pm.post_id = p.id) AS media,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', lu.id, 'username', lu.username)) FROM post_likes pl JOIN users lu ON pl.user_id = lu.id WHERE pl.post_id = p.id) as likedBy,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', su.id, 'username', su.username)) FROM post_saves ps JOIN users su ON ps.user_id = su.id WHERE ps.post_id = p.id) as savedBy,
        (SELECT JSON_ARRAYAGG(
             JSON_OBJECT('id', c.id, 'text', c.text, 'timestamp', c.created_at, 'user', 
                JSON_OBJECT('id', cu.id, 'username', cu.username, 'avatar', cu.avatar_url)
             )
        ) FROM (SELECT * FROM comments WHERE post_id = p.id ORDER BY created_at DESC) c JOIN users cu ON c.user_id = cu.id) AS comments
    FROM posts p
    JOIN users u ON p.user_id = u.id
`;

// @desc    Get main feed for the current user
// @route   GET /api/posts/feed
// @access  Private
router.get('/feed', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [posts] = await pool.query(
            `${POST_QUERY} 
             WHERE (p.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) OR p.user_id = ?)
             AND p.is_archived = FALSE
             ORDER BY p.created_at DESC LIMIT 20`,
            [userId, userId]
        );
        res.json({ posts: posts.map(p => ({...p, comments: p.comments || [], likedBy: p.likedBy || [], savedBy: p.savedBy || []})) });
    } catch (error) {
        console.error('Get Feed Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get posts for the explore page
// @route   GET /api/posts/explore
// @access  Private
router.get('/explore', protect, async (req, res) => {
    try {
        const [posts] = await pool.query(
            `${POST_QUERY}
             WHERE p.is_archived = FALSE
             ORDER BY RAND() LIMIT 30`
        );
        res.json({ posts: posts.map(p => ({...p, comments: p.comments || [], likedBy: p.likedBy || [], savedBy: p.savedBy || []})) });
    } catch (error) {
        console.error('Get Explore Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, upload.array('media', 10), async (req, res) => {
    const { caption, location } = req.body;
    const userId = req.user.id;
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "At least one media file is required." });
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [postResult] = await connection.query(
            'INSERT INTO posts (user_id, caption, location) VALUES (?, ?, ?)',
            [userId, caption, location]
        );
        const postId = postResult.insertId;

        const mediaPromises = req.files.map((file, index) => {
            const mediaUrl = `/uploads/${file.filename}`;
            const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
            return connection.query(
                'INSERT INTO post_media (post_id, media_url, media_type, sort_order) VALUES (?, ?, ?, ?)',
                [postId, mediaUrl, mediaType, index]
            );
        });
        await Promise.all(mediaPromises);

        await connection.commit();
        const [newPost] = await connection.query('SELECT * FROM posts WHERE id = ?', [postId]);
        res.status(201).json(newPost[0]);
    } catch (error) {
        await connection.rollback();
        console.error('Create Post Error:', error);
        res.status(500).json({ message: 'Server error while creating post.' });
    } finally {
        connection.release();
    }
});

// @desc    Toggle like on a post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const io = req.app.get('io');

    try {
        const [existingLike] = await pool.query('SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
        
        if (existingLike.length > 0) {
            await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            res.json({ message: 'Post unliked successfully' });
        } else {
            await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            
            const [postOwner] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
            if (postOwner.length > 0 && postOwner[0].user_id !== userId) {
                 const [notifResult] = await pool.query(
                    'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                    [postOwner[0].user_id, userId, 'like_post', postId]
                );
                 const [newNotif] = await pool.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar, p.id as post_id FROM notifications n JOIN users u ON n.actor_id = u.id LEFT JOIN posts p ON n.entity_id = p.id WHERE n.id = ?', [notifResult.insertId]);
                
                const targetSocket = getSocketFromUserId(postOwner[0].user_id);
                if (targetSocket) {
                    targetSocket.emit('new_notification', newNotif[0]);
                }
            }

            res.json({ message: 'Post liked successfully' });
        }
    } catch (error) {
        console.error('Toggle Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Toggle save on a post
// @route   POST /api/posts/:id/save
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const [existingSave] = await pool.query('SELECT * FROM post_saves WHERE post_id = ? AND user_id = ?', [postId, userId]);
        if (existingSave.length > 0) {
            await pool.query('DELETE FROM post_saves WHERE post_id = ? AND user_id = ?', [postId, userId]);
            res.json({ message: 'Post unsaved successfully' });
        } else {
            await pool.query('INSERT INTO post_saves (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            res.json({ message: 'Post saved successfully' });
        }
    } catch (error) {
        console.error('Toggle Save Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;
    const io = req.app.get('io');

    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    try {
        const [result] = await pool.query('INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)', [postId, userId, text]);
        
        const [postOwner] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
        if (postOwner.length > 0 && postOwner[0].user_id !== userId) {
            const [notifResult] = await pool.query(
                'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                [postOwner[0].user_id, userId, 'comment_post', postId]
            );
             const [newNotif] = await pool.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar, p.id as post_id FROM notifications n JOIN users u ON n.actor_id = u.id LEFT JOIN posts p ON n.entity_id = p.id WHERE n.id = ?', [notifResult.insertId]);

            const targetSocket = getSocketFromUserId(postOwner[0].user_id);
            if (targetSocket) {
                targetSocket.emit('new_notification', newNotif[0]);
            }
        }

        const [newComment] = await pool.query('SELECT c.*, u.username, u.avatar_url as avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?', [result.insertId]);
        res.status(201).json(newComment[0]);
    } catch (error) {
        console.error('Add Comment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { caption, location } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const [result] = await pool.query(
            'UPDATE posts SET caption = ?, location = ? WHERE id = ? AND user_id = ?',
            [caption, location, postId, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or user not authorized.' });
        }
        res.json({ message: 'Post updated successfully.' });
    } catch (error) {
        console.error('Update Post Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        // In a real app with storage like S3, you'd also delete the files from the bucket.
        const [result] = await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or user not authorized.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete Post Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Archive a post
// @route   PUT /api/posts/:id/archive
// @access  Private
router.put('/:id/archive', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const [result] = await pool.query('UPDATE posts SET is_archived = TRUE WHERE id = ? AND user_id = ?', [postId, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or user not authorized.' });
        }
        res.json({ message: 'Post archived successfully.' });
    } catch(error) {
        console.error('Archive Post Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Unarchive a post
// @route   PUT /api/posts/:id/unarchive
// @access  Private
router.put('/:id/unarchive', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const [result] = await pool.query('UPDATE posts SET is_archived = FALSE WHERE id = ? AND user_id = ?', [postId, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or user not authorized.' });
        }
        res.json({ message: 'Post unarchived successfully.' });
    } catch(error) {
        console.error('Unarchive Post Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
