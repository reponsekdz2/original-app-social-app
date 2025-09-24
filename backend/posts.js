import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

const hydrateUserObject = (userRow) => ({
    id: userRow.id || userRow.user_id,
    username: userRow.username,
    name: userRow.name,
    avatar_url: userRow.avatar_url,
    bio: userRow.bio,
    website: userRow.website,
    isVerified: !!userRow.is_verified,
    isPrivate: !!userRow.is_private,
    isPremium: !!userRow.is_premium,
    isAdmin: !!userRow.is_admin,
    status: userRow.status,
    created_at: userRow.created_at || userRow.user_created_at,
});


export default (upload) => {
    // GET /api/posts - Get posts for the user's feed
    router.get('/', isAuthenticated, async (req, res) => {
        try {
            const [posts] = await pool.query(`
                SELECT 
                    p.id, p.caption, p.location, p.created_at as timestamp,
                    u.id as user_id, u.username, u.name, u.avatar_url, u.bio, u.website, u.is_verified, 
                    u.is_private, u.is_premium, u.is_admin, u.status, u.created_at as user_created_at,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.user_id = ? OR p.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?)
                ORDER BY p.created_at DESC
                LIMIT 25;
            `, [req.session.userId, req.session.userId]);

            for (const post of posts) {
                const [media] = await pool.query('SELECT id, media_url as url, media_type as type FROM post_media WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
                const [comments] = await pool.query(`
                    SELECT 
                        c.id, c.text, c.created_at as timestamp, 
                        u.id as user_id, u.username, u.name, u.avatar_url, u.bio, u.website, u.is_verified, 
                        u.is_private, u.is_premium, u.is_admin, u.status, u.created_at as user_created_at
                    FROM comments c 
                    JOIN users u ON c.user_id = u.id 
                    WHERE c.post_id = ? 
                    ORDER BY c.created_at DESC 
                    LIMIT 2
                `, [post.id]);
                
                const [likedByUsers] = await pool.query(`
                    SELECT u.* 
                    FROM post_likes pl 
                    JOIN users u ON pl.user_id = u.id 
                    WHERE pl.post_id = ?
                `, [post.id]);

                const [[isSaved]] = await pool.query('SELECT COUNT(*) as count FROM post_saves WHERE post_id = ? AND user_id = ?', [post.id, req.session.userId]);
                
                const [[poll]] = await pool.query('SELECT * FROM polls WHERE post_id = ?', [post.id]);
                if (poll) {
                    const [options] = await pool.query('SELECT id, text, (SELECT COUNT(*) FROM poll_votes WHERE option_id = po.id) as votes FROM poll_options po WHERE poll_id = ?', [poll.id]);
                    const [[userVote]] = await pool.query('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', [poll.id, req.session.userId]);
                    post.poll = {
                        id: poll.id,
                        question: poll.question,
                        options: options,
                        userVote: userVote ? userVote.option_id : null,
                    };
                }

                post.media = media;
                post.comments = comments.map(c => ({
                    id: c.id,
                    text: c.text,
                    timestamp: c.timestamp,
                    likes: 0, // Mocked as comment likes are not tracked in detail here
                    likedBy: [], // Mocked
                    user: hydrateUserObject({ ...c, id: c.user_id, created_at: c.user_created_at })
                }));
                post.likes = post.likes_count;
                post.likedBy = likedByUsers.map(hydrateUserObject);
                post.isSaved = isSaved.count > 0;
                post.user = hydrateUserObject({ id: post.user_id, ...post });
            }
            
            res.json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ message: "Internal server error." });
        }
    });

    // POST /api/posts - Create a new post
    router.post('/', isAuthenticated, upload.array('media'), async (req, res) => {
        const { caption, location, pollQuestion, pollOptions } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one media file is required." });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO posts (user_id, caption, location) VALUES (?, ?, ?)',
                [req.session.userId, caption, location || null]
            );
            const postId = result.insertId;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const mediaUrl = `/uploads/${file.filename}`;
                const mediaType = file.mimetype.startsWith('image') ? 'image' : 'video';
                await connection.query(
                    'INSERT INTO post_media (post_id, media_url, media_type, sort_order) VALUES (?, ?, ?, ?)',
                    [postId, mediaUrl, mediaType, i]
                );
            }

            if (pollQuestion && pollOptions) {
                const options = JSON.parse(pollOptions);
                const [pollResult] = await connection.query('INSERT INTO polls (post_id, question) VALUES (?, ?)', [postId, pollQuestion]);
                const pollId = pollResult.insertId;
                for (const optionText of options) {
                    await connection.query('INSERT INTO poll_options (poll_id, text) VALUES (?, ?)', [pollId, optionText]);
                }
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
    
    // POST /api/posts/:id/like
    router.post('/:id/like', isAuthenticated, async (req, res) => {
        const { id: postId } = req.params;
        const userId = req.session.userId;
        try {
            const [[existingLike]] = await pool.query('SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            if(existingLike) {
                await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            } else {
                await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            }
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });
    
    // POST /api/posts/:id/save
     router.post('/:id/save', isAuthenticated, async (req, res) => {
        const { id: postId } = req.params;
        const userId = req.session.userId;
        try {
            const [[existingSave]] = await pool.query('SELECT * FROM post_saves WHERE post_id = ? AND user_id = ?', [postId, userId]);
            if(existingSave) {
                await pool.query('DELETE FROM post_saves WHERE post_id = ? AND user_id = ?', [postId, userId]);
            } else {
                await pool.query('INSERT INTO post_saves (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            }
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // POST /api/posts/:id/comments
    router.post('/:id/comments', isAuthenticated, async (req, res) => {
        const { id: postId } = req.params;
        const { text } = req.body;
        try {
            const [result] = await pool.query('INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)', [postId, req.session.userId, text]);
            const [[commentData]] = await pool.query(`
                SELECT 
                    c.id, c.text, c.created_at as timestamp, 
                    u.*
                FROM comments c 
                JOIN users u ON c.user_id = u.id 
                WHERE c.id = ?
            `, [result.insertId]);

            const newComment = {
                id: commentData.id,
                text: commentData.text,
                timestamp: commentData.timestamp,
                likes: 0,
                likedBy: [],
                user: hydrateUserObject(commentData)
            };
            
            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

     // POST /api/posts/:postId/tip
    router.post('/:postId/tip', isAuthenticated, async (req, res) => {
        const { postId } = req.params;
        const { amount } = req.body;
        const senderId = req.session.userId;
        
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [[sender]] = await connection.query('SELECT wallet_balance FROM users WHERE id = ?', [senderId]);
            if (sender.wallet_balance < amount) {
                await connection.rollback();
                return res.status(400).json({ message: 'Insufficient funds.' });
            }

            const [[receiver]] = await connection.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
            const receiverId = receiver.user_id;

            await connection.query('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?', [amount, senderId]);
            await connection.query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [amount, receiverId]);
            await connection.query('INSERT INTO transactions (sender_id, receiver_id, post_id, amount, type) VALUES (?, ?, ?, ?, ?)', [senderId, receiverId, postId, amount, 'tip']);
            
            await connection.commit();
            res.sendStatus(200);
        } catch(error) {
            await connection.rollback();
            res.status(500).json({ message: "Transaction failed." });
        } finally {
            connection.release();
        }
    });


    return router;
};