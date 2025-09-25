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
    // GET /api/posts - Get posts for the user's feed (Optimized)
    router.get('/', isAuthenticated, async (req, res) => {
        try {
            const userId = req.session.userId;
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
            `, [userId, userId]);

            if (posts.length === 0) {
                return res.json([]);
            }

            const postIds = posts.map(p => p.id);

            // Fetch all related data in bulk
            const [media] = await pool.query('SELECT post_id, id, media_url as url, media_type as type FROM post_media WHERE post_id IN (?) ORDER BY sort_order ASC', [postIds]);
            const [comments] = await pool.query(`
                SELECT c.post_id, c.id, c.text, c.created_at as timestamp, 
                       u.id as user_id, u.username, u.name, u.avatar_url, u.is_verified
                FROM comments c JOIN users u ON c.user_id = u.id
                WHERE c.post_id IN (?) ORDER BY c.created_at DESC`, [postIds]);
            const [likedByUsers] = await pool.query('SELECT pl.post_id, u.id, u.username, u.name, u.avatar_url, u.is_verified FROM post_likes pl JOIN users u ON pl.user_id = u.id WHERE pl.post_id IN (?)', [postIds]);
            const [savedPosts] = await pool.query('SELECT post_id FROM post_saves WHERE user_id = ? AND post_id IN (?)', [userId, postIds]);
            const [polls] = await pool.query('SELECT * FROM polls WHERE post_id IN (?)', [postIds]);
            const pollIds = polls.map(p => p.id);
            const pollOptions = pollIds.length > 0 ? (await pool.query('SELECT po.poll_id, po.id, po.text, (SELECT COUNT(*) FROM poll_votes WHERE option_id = po.id) as votes FROM poll_options po WHERE po.poll_id IN (?)', [pollIds]))[0] : [];
            const userVotes = pollIds.length > 0 ? (await pool.query('SELECT poll_id, option_id FROM poll_votes WHERE user_id = ? AND poll_id IN (?)', [userId, pollIds]))[0] : [];


            // Map data back to posts
            const savedPostIds = new Set(savedPosts.map(s => s.post_id));
            const userVotesMap = new Map(userVotes.map(v => [v.poll_id, v.option_id]));

            const postsWithData = posts.map(post => {
                const postPoll = polls.find(p => p.post_id === post.id);
                return {
                    ...post,
                    user: hydrateUserObject({ id: post.user_id, ...post }),
                    media: media.filter(m => m.post_id === post.id),
                    comments: comments.filter(c => c.post_id === post.id).slice(0, 2).map(c => ({
                        id: c.id, text: c.text, timestamp: c.timestamp, likes: 0, likedBy: [],
                        user: hydrateUserObject({ ...c, id: c.user_id })
                    })),
                    likes: post.likes_count,
                    likedBy: likedByUsers.filter(u => u.post_id === post.id).map(hydrateUserObject),
                    isSaved: savedPostIds.has(post.id),
                    poll: postPoll ? {
                        id: postPoll.id,
                        question: postPoll.question,
                        options: pollOptions.filter(o => o.poll_id === postPoll.id),
                        userVote: userVotesMap.get(postPoll.id) || null
                    } : null
                };
            });

            res.json(postsWithData);
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

    // PUT /api/posts/:id - Edit a post
    router.put('/:id', isAuthenticated, async (req, res) => {
        const { id: postId } = req.params;
        const { caption, location } = req.body;
        try {
            await pool.query(
                'UPDATE posts SET caption = ?, location = ? WHERE id = ? AND user_id = ?',
                [caption, location, postId, req.session.userId]
            );
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // POST /api/posts/:id/archive
    router.post('/:id/archive', isAuthenticated, async (req, res) => {
        const { id: postId } = req.params;
        try {
            await pool.query('UPDATE posts SET is_archived = 1 WHERE id = ? AND user_id = ?', [postId, req.session.userId]);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // POST /api/posts/:id/unarchive
    router.post('/:id/unarchive', isAuthenticated, async (req, res) => {
        const { id: postId } = req.params;
        try {
            await pool.query('UPDATE posts SET is_archived = 0 WHERE id = ? AND user_id = ?', [postId, req.session.userId]);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // POST /api/posts/poll/:pollId/vote
    router.post('/poll/:pollId/vote', isAuthenticated, async (req, res) => {
        const { pollId } = req.params;
        const { optionId } = req.body;
        const userId = req.session.userId;
        try {
            // Use INSERT ... ON DUPLICATE KEY UPDATE to handle new votes and vote changes
            await pool.query(
                'INSERT INTO poll_votes (user_id, poll_id, option_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE option_id = ?',
                [userId, pollId, optionId, optionId]
            );
            res.sendStatus(200);
        } catch (error) {
             res.status(500).json({ message: "Internal server error" });
        }
    });


    return router;
};