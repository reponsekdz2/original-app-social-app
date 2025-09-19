import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// --- Helper Functions ---
const getPostById = async (postId) => {
    const [postRows] = await pool.query(`
        SELECT 
            p.id, p.caption, p.location, p.created_at as timestamp,
            u.id as user_id, u.username, u.name, u.avatar_url as avatar, u.is_verified
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?`, [postId]);
    
    if (postRows.length === 0) return null;
    
    let post = postRows[0];
    post.user = { id: post.user_id, username: post.username, name: post.name, avatar: post.avatar, is_verified: post.is_verified };
    
    // Fetch media, likes, comments etc.
    const [media] = await pool.query('SELECT id, media_url as url, media_type as type FROM post_media WHERE post_id = ?', [postId]);
    post.media = media;

    const [likes] = await pool.query('SELECT user_id FROM post_likes WHERE post_id = ?', [postId]);
    post.likedBy = likes.map(l => l.user_id);
    post.likes = likes.length;

    const [saves] = await pool.query('SELECT user_id FROM post_saves WHERE post_id = ?', [postId]);
    post.savedBy = saves.map(s => s.user_id);
    
    const [comments] = await pool.query(`
        SELECT c.id, c.text, c.created_at as timestamp, u.id as user_id, u.username, u.name, u.avatar_url as avatar
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ? ORDER BY c.created_at ASC`, [postId]);
    
    post.comments = comments.map(c => ({
        id: c.id, text: c.text, timestamp: c.timestamp, 
        user: { id: c.user_id, username: c.username, name: c.name, avatar: c.avatar }
    }));
    
    return post;
};


// --- Routes ---

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, upload.array('media', 10), async (req, res) => {
    const { caption, location } = req.body;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Please upload at least one media file." });
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
                'INSERT INTO post_media (post_id, media_url, media_type, position) VALUES (?, ?, ?, ?)',
                [postId, mediaUrl, mediaType, index]
            );
        });

        await Promise.all(mediaPromises);
        await connection.commit();
        
        const newPost = await getPostById(postId);
        res.status(201).json(newPost);

    } catch (error) {
        await connection.rollback();
        console.error('Create Post Error:', error);
        res.status(500).json({ message: 'Server error while creating post.' });
    } finally {
        connection.release();
    }
});


// @desc    Toggle like on a post
// @route   POST /api/posts/:id/toggle-like
// @access  Private
router.post('/:id/toggle-like', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const [existingLike] = await pool.query('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
        
        if (existingLike.length > 0) {
            await pool.query('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
        } else {
            await pool.query('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
        }
        
        const updatedPost = await getPostById(postId);
        req.app.get('io').emit('post_updated', updatedPost);
        res.json(updatedPost);

    } catch (error) {
        console.error('Toggle Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Add a comment
// @route   POST /api/posts/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;
    
    if(!text) return res.status(400).json({ message: 'Comment text is required.' });

    try {
        await pool.query(
            'INSERT INTO comments (user_id, post_id, text) VALUES (?, ?, ?)',
            [userId, postId, text]
        );
        
        const updatedPost = await getPostById(postId);
        req.app.get('io').emit('post_updated', updatedPost);
        res.status(201).json(updatedPost);
    } catch (error) {
        console.error('Add Comment Error:', error);
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
        const [postRows] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
        if (postRows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (postRows[0].user_id !== userId) {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }
        
        await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
        
        req.app.get('io').emit('post_deleted', { postId });
        res.status(204).send();

    } catch (error) {
        console.error('Delete Post Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
