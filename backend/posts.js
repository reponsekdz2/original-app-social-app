import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// --- Multer Setup for Post Uploads ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `post-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

const POST_QUERY_FIELDS = `
    p.id, p.caption, p.location, p.created_at,
    JSON_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar_url, 'is_verified', u.is_verified) as user,
    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes,
    EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) as is_liked_by_user,
    EXISTS(SELECT 1 FROM post_saves WHERE post_id = p.id AND user_id = ?) as is_saved_by_user,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pm.id, 'url', pm.media_url, 'type', pm.media_type)) FROM post_media pm WHERE pm.post_id = p.id) as media,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'text', c.text, 'user', JSON_OBJECT('id', cu.id, 'username', cu.username))) FROM (SELECT * FROM comments WHERE post_id = p.id ORDER BY created_at DESC LIMIT 2) c JOIN users cu ON c.user_id = cu.id) as comments
`;

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, upload.array('media', 10), async (req, res) => {
    const { caption, location } = req.body;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Post media is required." });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [postResult] = await connection.query(
            'INSERT INTO posts (user_id, caption, location) VALUES (?, ?, ?)',
            [userId, caption, location]
        );
        const postId = postResult.insertId;

        for (const file of req.files) {
            const mediaUrl = `/uploads/${file.filename}`;
            const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
            await connection.query(
                'INSERT INTO post_media (post_id, media_url, media_type) VALUES (?, ?, ?)',
                [postId, mediaUrl, mediaType]
            );
        }

        await connection.commit();

        // Fetch the newly created post to return it
        const [rows] = await connection.query(`SELECT ${POST_QUERY_FIELDS} FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`, [userId, userId, postId]);
        res.status(201).json(rows[0]);

    } catch (error) {
        await connection.rollback();
        console.error('Create Post Error:', error);
        res.status(500).json({ message: 'Server error while creating post.' });
    } finally {
        connection.release();
    }
});


// @desc    Toggle like on a post
// @route   POST /api/posts/:postId/like
// @access  Private
router.post('/:postId/like', protect, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const [isLiked] = await pool.query('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, postId]);

        if (isLiked.length > 0) {
            await pool.query('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
            res.json({ liked: false });
        } else {
            await pool.query('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            // TODO: Create a notification
            res.json({ liked: true });
        }
    } catch (error) {
        console.error('Toggle Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Toggle save on a post
// @route   POST /api/posts/:postId/save
// @access  Private
router.post('/:postId/save', protect, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const [isSaved] = await pool.query('SELECT * FROM post_saves WHERE user_id = ? AND post_id = ?', [userId, postId]);
        if (isSaved.length > 0) {
            await pool.query('DELETE FROM post_saves WHERE user_id = ? AND post_id = ?', [userId, postId]);
            res.json({ saved: false });
        } else {
            await pool.query('INSERT INTO post_saves (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            res.json({ saved: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Archive a post
// @route   POST /api/posts/:postId/archive
// @access  Private
router.post('/:postId/archive', protect, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const [result] = await pool.query(
            'UPDATE posts SET is_archived = TRUE WHERE id = ? AND user_id = ?',
            [postId, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or you are not authorized.' });
        }
        res.json({ success: true, isArchived: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Unarchive a post
// @route   POST /api/posts/:postId/unarchive
// @access  Private
router.post('/:postId/unarchive', protect, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const [result] = await pool.query(
            'UPDATE posts SET is_archived = FALSE WHERE id = ? AND user_id = ?',
            [postId, userId]
        );
         if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or you are not authorized.' });
        }
        res.json({ success: true, isArchived: false });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Delete a post
// @route   DELETE /api/posts/:postId
// @access  Private
router.delete('/:postId', protect, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
        if (result.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ message: 'Post not found or user not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Edit a post
// @route   PUT /api/posts/:postId
// @access  Private
router.put('/:postId', protect, async (req, res) => {
    const { postId } = req.params;
    const { caption, location } = req.body;
    const userId = req.user.id;
    try {
        const [result] = await pool.query(
            'UPDATE posts SET caption = ?, location = ? WHERE id = ? AND user_id = ?',
            [caption, location, postId, userId]
        );
         if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or you are not authorized.' });
        }
        const [rows] = await pool.query(`SELECT ${POST_QUERY_FIELDS} FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`, [userId, userId, postId]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
