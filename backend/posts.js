
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

export default (upload) => {
    // GET /api/posts/feed
    router.get('/feed', isAuthenticated, async (req, res) => {
        try {
            // A simple reverse chronological feed for now
            const [posts] = await pool.query(`
                SELECT 
                    p.id, p.caption, p.location, p.created_at as timestamp,
                    u.id as user_id, u.username, u.avatar_url, u.is_verified,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes,
                    EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) as is_liked,
                    EXISTS(SELECT 1 FROM post_saves WHERE post_id = p.id AND user_id = ?) as is_saved
                FROM posts p
                JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
                LIMIT 50;
            `, [req.session.userId, req.session.userId]);

            for (const post of posts) {
                const [media] = await pool.query('SELECT id, media_url as url, media_type as type FROM post_media WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
                post.media = media;

                // For simplicity, fetching a couple of comments. A full app would paginate this.
                const [comments] = await pool.query(`
                    SELECT c.id, c.text, c.created_at as timestamp, u.username, u.avatar_url 
                    FROM comments c 
                    JOIN users u ON c.user_id = u.id 
                    WHERE c.post_id = ? 
                    ORDER BY c.created_at DESC LIMIT 2`, [post.id]);
                post.comments = comments.map(c => ({...c, user: { username: c.username, avatar_url: c.avatar_url }}));
                
                // You would also fetch likedBy users, etc. This is simplified for brevity.
                post.likedBy = [];
            }

            res.json(posts);
        } catch (error) {
            console.error('Error fetching feed:', error);
            res.status(500).json({ message: "Internal server error." });
        }
    });

    // POST /api/posts - Create new post
    router.post('/', isAuthenticated, upload.array('media', 10), async (req, res) => {
        const { caption, location } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "Post must include at least one photo or video." });
        }
        
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [postResult] = await connection.query(
                'INSERT INTO posts (user_id, caption, location) VALUES (?, ?, ?)',
                [req.session.userId, caption, location]
            );
            const postId = postResult.insertId;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const mediaUrl = `/uploads/${file.filename}`;
                const mediaType = file.mimetype.startsWith('image') ? 'image' : 'video';
                await connection.query(
                    'INSERT INTO post_media (post_id, media_url, media_type, sort_order) VALUES (?, ?, ?, ?)',
                    [postId, mediaUrl, mediaType, i]
                );
            }
            
            await connection.commit();
            res.status(201).json({ message: 'Post created successfully', postId });

        } catch (error) {
            await connection.rollback();
            console.error('Error creating post:', error);
            res.status(500).json({ message: 'Failed to create post.' });
        } finally {
            connection.release();
        }
    });
    
    // POST /api/posts/:id/like - Toggle like on a post
    router.post('/:id/like', isAuthenticated, async (req, res) => {
        const postId = req.params.id;
        const userId = req.session.userId;
        try {
            const [existingLike] = await pool.query('SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            if (existingLike.length > 0) {
                // Unlike
                await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
                res.json({ message: 'Post unliked' });
            } else {
                // Like
                await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
                res.json({ message: 'Post liked' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    // POST /api/posts/:id/save - Toggle save on a post
     router.post('/:id/save', isAuthenticated, async (req, res) => {
        const postId = req.params.id;
        const userId = req.session.userId;
        try {
            const [existingSave] = await pool.query('SELECT * FROM post_saves WHERE post_id = ? AND user_id = ?', [postId, userId]);
            if (existingSave.length > 0) {
                await pool.query('DELETE FROM post_saves WHERE post_id = ? AND user_id = ?', [postId, userId]);
                res.json({ message: 'Post unsaved' });
            } else {
                await pool.query('INSERT INTO post_saves (post_id, user_id) VALUES (?, ?)', [postId, userId]);
                res.json({ message: 'Post saved' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    // POST /api/posts/:id/tip
    router.post('/:id/tip', isAuthenticated, async (req, res) => {
        const { amount } = req.body;
        const postId = req.params.id;
        const senderId = req.session.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid tip amount." });
        }
        
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [[sender]] = await connection.query('SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE', [senderId]);
            if (sender.wallet_balance < amount) {
                await connection.rollback();
                return res.status(400).json({ message: "Insufficient funds." });
            }
            
            const [[post]] = await connection.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
            const receiverId = post.user_id;

            if(senderId === receiverId) {
                await connection.rollback();
                return res.status(400).json({ message: "You cannot tip yourself." });
            }

            await connection.query('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?', [amount, senderId]);
            await connection.query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [amount, receiverId]);
            await connection.query(
                'INSERT INTO transactions (sender_id, receiver_id, post_id, amount, type) VALUES (?, ?, ?, ?, ?)',
                [senderId, receiverId, postId, amount, 'tip']
            );

            await connection.commit();
            res.json({ message: `Successfully tipped $${amount}`});

        } catch (error) {
            await connection.rollback();
            console.error('Error sending tip:', error);
            res.status(500).json({ message: 'Failed to send tip.' });
        } finally {
            connection.release();
        }
    });


    return router;
};
