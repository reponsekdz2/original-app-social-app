import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();
const POSTS_PER_PAGE = 10;

const parseTags = (caption) => {
    const regex = /#([a-zA-Z0-9_]+)/g;
    const tags = caption.match(regex);
    return tags ? tags.map(tag => tag.substring(1)) : [];
};

export default (upload) => {

    router.get('/feed', isAuthenticated, async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * POSTS_PER_PAGE;

        try {
            const [posts] = await pool.query(`
                SELECT p.*, u.username, u.avatar_url, u.is_verified
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) OR p.user_id = ?
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?
            `, [req.session.userId, req.session.userId, POSTS_PER_PAGE, offset]);
            
            for (const post of posts) {
                const [media] = await pool.query('SELECT id, media_url as url, media_type as type FROM post_media WHERE post_id = ? ORDER BY sort_order ASC', [post.id]);
                const [likes] = await pool.query('SELECT user_id FROM post_likes WHERE post_id = ?', [post.id]);
                const [comments] = await pool.query('SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC LIMIT 2', [post.id]);
                const [[{ is_saved }]] = await pool.query('SELECT COUNT(*) > 0 as is_saved FROM post_saves WHERE post_id = ? AND user_id = ?', [post.id, req.session.userId]);
                const [[poll]] = await pool.query('SELECT * FROM polls WHERE post_id = ?', [post.id]);
                
                if (poll) {
                    const [options] = await pool.query('SELECT po.id, po.text, COUNT(pv.user_id) as votes FROM poll_options po LEFT JOIN poll_votes pv ON po.id = pv.option_id WHERE po.poll_id = ? GROUP BY po.id', [poll.id]);
                    const [[userVote]] = await pool.query('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', [poll.id, req.session.userId]);
                    poll.options = options;
                    poll.userVote = userVote ? userVote.option_id : null;
                }

                post.media = media;
                post.likedBy = likes.map(l => ({ id: l.user_id }));
                post.likes = likes.length;
                post.comments = comments.map(c => ({...c, user: { id: c.user_id, username: c.username, avatar_url: c.avatar_url } }));
                post.isSaved = !!is_saved;
                post.poll = poll || null;
                post.user = { id: post.user_id, username: post.username, avatar_url: post.avatar_url, isVerified: !!post.is_verified };
            }

            res.json(posts);
        } catch(e) {
            console.error("Feed error:", e)
            res.status(500).json({message: 'server error'});
        }
    });

    router.get('/explore', isAuthenticated, async (req, res) => {
        try {
            const [posts] = await pool.query(`
                SELECT 
                    p.id, p.caption,
                    (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) as likes_count,
                    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments_count
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE u.is_private = 0 
                  AND p.is_archived = 0
                  AND p.user_id != ?
                ORDER BY RAND()
                LIMIT 42
            `, [req.session.userId]);

            for (const post of posts) {
                const [media] = await pool.query('SELECT id, media_url as url, media_type as type FROM post_media WHERE post_id = ? ORDER BY sort_order', [post.id]);
                post.media = media;
                post.likes = post.likes_count;
                post.comments = Array(post.comments_count).fill({}); 
            }
            
            res.json(posts);
        } catch (error) {
            console.error("Error fetching explore posts:", error);
            res.status(500).json({ message: 'Server error fetching explore content' });
        }
    });

    router.post('/', isAuthenticated, upload.array('media'), async (req, res) => {
        const { caption, location, pollQuestion, pollOptions: pollOptionsJSON } = req.body;
        const files = req.files;
        const userId = req.session.userId;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Media file is required.' });
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [postResult] = await connection.query(
                'INSERT INTO posts (user_id, caption, location) VALUES (?, ?, ?)',
                [userId, caption, location || null]
            );
            const postId = postResult.insertId;

            const mediaData = files.map((file, index) => [
                postId,
                `/uploads/${file.filename}`,
                file.mimetype.startsWith('image') ? 'image' : 'video',
                index
            ]);
            await connection.query('INSERT INTO post_media (post_id, media_url, media_type, sort_order) VALUES ?', [mediaData]);
            
            if (pollQuestion && pollOptionsJSON) {
                const pollOptions = JSON.parse(pollOptionsJSON);
                if (pollOptions.length >= 2) {
                    const [pollResult] = await connection.query('INSERT INTO polls (post_id, question) VALUES (?, ?)', [postId, pollQuestion]);
                    const pollId = pollResult.insertId;
                    const pollOptionsData = pollOptions.map((opt: string) => [pollId, opt]);
                    await connection.query('INSERT INTO poll_options (poll_id, text) VALUES ?', [pollOptionsData]);
                }
            }

            await connection.commit();

            // Fetch the full post object to return it to the client for an optimistic update
            const [[user]] = await connection.query('SELECT username, avatar_url, is_verified FROM users WHERE id = ?', [userId]);
            const [media] = await connection.query('SELECT id, media_url as url, media_type as type FROM post_media WHERE post_id = ? ORDER BY sort_order ASC', [postId]);
             const newPost = {
                id: postId,
                user: { id: userId, username: user.username, avatar_url: user.avatar_url, isVerified: user.is_verified },
                media: media,
                caption: caption,
                location: location || null,
                likes: 0,
                likedBy: [],
                comments: [],
                isSaved: false,
                timestamp: new Date().toISOString(),
                poll: null, // Simplified for now
            };

            res.status(201).json(newPost);

        } catch (error) {
            await connection.rollback();
            console.error("Error creating post:", error);
            res.status(500).json({ message: "Failed to create post." });
        } finally {
            connection.release();
        }
    });

    router.post('/:id/like', isAuthenticated, async (req, res) => {
        const { id: postId } = req.params;
        const userId = req.session.userId;
        const io = req.app.get('io');
        
        try {
            const [[existingLike]] = await pool.query('SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);

            if (existingLike) {
                await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            } else {
                await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            }
            
            const [[{likes}]] = await pool.query('SELECT COUNT(*) as likes FROM post_likes WHERE post_id = ?', [postId]);
            io.emit('like_update', { postId, likes });
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: 'Error liking post' });
        }
    });
    
     router.post('/comment', isAuthenticated, async (req, res) => {
        const { postId, text } = req.body;
        const userId = req.session.userId;
        const io = req.app.get('io');

        try {
            const [result] = await pool.query('INSERT INTO comments (post_id, user_id, text) VALUES (?,?,?)', [postId, userId, text]);
            const [[comment]] = await pool.query('SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?', [result.insertId]);
            comment.user = { id: comment.user_id, username: comment.username, avatar_url: comment.avatar_url };
            
            io.emit('new_comment', { postId, comment });
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Error creating comment' });
        }
    });

    router.post('/poll/vote', isAuthenticated, async (req, res) => {
        const { pollId, optionId } = req.body;
        const userId = req.session.userId;
        
        if (!pollId || optionId === undefined) {
            return res.status(400).json({ message: 'Poll ID and Option ID are required.' });
        }

        try {
            // Upsert logic: delete old vote if exists, then insert new one
            await pool.query('DELETE FROM poll_votes WHERE poll_id = ? AND user_id = ?', [pollId, userId]);
            await pool.query('INSERT INTO poll_votes (poll_id, user_id, option_id) VALUES (?, ?, ?)', [pollId, userId, optionId]);
            res.status(200).json({ message: 'Vote recorded successfully.' });
        } catch (error) {
            console.error('Error recording poll vote:', error);
            res.status(500).json({ message: 'Failed to record vote.' });
        }
    });

    return router;
};
