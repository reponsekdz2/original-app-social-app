import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { getSocketByUserId } from './socket.js';

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
        // Fetch the new post to return to the client
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
            // Unlike
            await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            res.json({ message: 'Post unliked successfully' });
        } else {
            // Like
            await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            
            // --- Create and Emit Notification ---
            const [postOwner] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
            if (postOwner.length > 0 && postOwner[0].user_id !== userId) {
                 const [notifResult] = await pool.query(
                    'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                    [postOwner[0].user_id, userId, 'like_post', postId]
                );
                 const [newNotif] = await pool.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar FROM notifications n JOIN users u ON n.actor_id = u.id WHERE n.id = ?', [notifResult.insertId]);
                
                const targetSocket = getSocketByUserId(io, postOwner[0].user_id);
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
        
        // --- Create and Emit Notification ---
        const [postOwner] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
        if (postOwner.length > 0 && postOwner[0].user_id !== userId) {
            const [notifResult] = await pool.query(
                'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                [postOwner[0].user_id, userId, 'comment_post', postId]
            );
             const [newNotif] = await pool.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar FROM notifications n JOIN users u ON n.actor_id = u.id WHERE n.id = ?', [notifResult.insertId]);

            const targetSocket = getSocketByUserId(io, postOwner[0].user_id);
            if (targetSocket) {
                targetSocket.emit('new_notification', newNotif[0]);
            }
        }

        const [newComment] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
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
    // Implementation for editing a post caption/location
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    // Implementation for deleting a post, ensure user is owner
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