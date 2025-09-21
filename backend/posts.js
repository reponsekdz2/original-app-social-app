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
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pm.id, 'url', pm.media_url, 'type', pm.media_type)) FROM post_media pm WHERE pm.post_id = p.id), JSON_ARRAY()) AS media,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', lu.id, 'username', lu.username, 'avatar', lu.avatar_url)) FROM post_likes pl JOIN users lu ON pl.user_id = lu.id WHERE pl.post_id = p.id), JSON_ARRAY()) as likedBy,
        COALESCE((SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', col.id, 'username', col.username, 'avatar', col.avatar_url)
        ) FROM post_collaborators pc JOIN users col ON pc.user_id = col.id WHERE pc.post_id = p.id AND pc.status = 'accepted'), JSON_ARRAY()) as collaborators,
        (SELECT JSON_OBJECT(
            'id', poll.id, 
            'question', poll.question,
            'options', (SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', po.id, 
                                'text', po.option_text,
                                'votes', (SELECT COUNT(*) FROM poll_votes pv WHERE pv.poll_option_id = po.id)
                            )
                        ) FROM poll_options po WHERE po.poll_id = poll.id),
            'userVote', (SELECT pv.poll_option_id FROM poll_votes pv JOIN poll_options po ON pv.poll_option_id = po.id WHERE po.poll_id = poll.id AND pv.user_id = ?)
        ) FROM polls poll WHERE poll.post_id = p.id) as poll,
        COALESCE((SELECT JSON_ARRAYAGG(
             JSON_OBJECT('id', c.id, 'text', c.text, 'timestamp', c.created_at, 'user', 
                JSON_OBJECT('id', cu.id, 'username', cu.username, 'avatar', cu.avatar_url)
             )
        ) FROM (SELECT * FROM comments WHERE post_id = p.id ORDER BY created_at DESC) c JOIN users cu ON c.user_id = cu.id), JSON_ARRAY()) AS comments,
        EXISTS(SELECT 1 FROM post_saves ps WHERE ps.post_id = p.id AND ps.user_id = ?) as isSaved
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
            [userId, userId, userId, userId]
        );
        res.json({ posts });
    } catch (error) {
        console.error('Get Feed Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get posts for the explore page
// @route   GET /api/posts/explore
// @access  Private
router.get('/explore', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [posts] = await pool.query(
            `${POST_QUERY}
             WHERE p.is_archived = FALSE
             ORDER BY RAND() LIMIT 30`,
             [userId, userId]
        );
        res.json({ posts });
    } catch (error) {
        console.error('Get Explore Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, upload.array('media', 10), async (req, res) => {
    const { caption, location, pollQuestion, pollOptions, collaborators } = req.body;
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

        // Handle media
        const mediaPromises = req.files.map((file, index) => {
            const mediaUrl = `/uploads/${file.filename}`;
            const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
            return connection.query(
                'INSERT INTO post_media (post_id, media_url, media_type, sort_order) VALUES (?, ?, ?, ?)',
                [postId, mediaUrl, mediaType, index]
            );
        });
        await Promise.all(mediaPromises);
        
        // Handle poll
        if (pollQuestion && pollOptions) {
            const options = JSON.parse(pollOptions);
            if(options.length > 1) {
                const [pollResult] = await connection.query(
                    'INSERT INTO polls (post_id, question) VALUES (?, ?)',
                    [postId, pollQuestion]
                );
                const pollId = pollResult.insertId;
                const optionPromises = options.map((opt: string) => 
                    connection.query('INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)', [pollId, opt])
                );
                await Promise.all(optionPromises);
            }
        }
        
        // Handle collaborators
        if (collaborators) {
            const collabIds = JSON.parse(collaborators);
            // Always add the post owner as an accepted collaborator
            await connection.query(
                'INSERT INTO post_collaborators (post_id, user_id, status) VALUES (?, ?, ?)',
                [postId, userId, 'accepted']
            );
            const collabPromises = collabIds.map((id: string) => 
                connection.query(
                    'INSERT INTO post_collaborators (post_id, user_id, status) VALUES (?, ?, ?)',
                    [postId, id, 'pending']
                )
            );
            await Promise.all(collabPromises);
            // TODO: Send notifications to collaborators
        }


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

// @desc    Vote on a poll
// @route   POST /api/posts/polls/:optionId/vote
// @access  Private
router.post('/polls/:optionId/vote', protect, async (req, res) => {
    const { optionId } = req.params;
    const userId = req.user.id;
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [[option]] = await connection.query('SELECT poll_id FROM poll_options WHERE id = ?', [optionId]);
        if (!option) {
            await connection.rollback();
            return res.status(404).json({ message: 'Poll option not found.' });
        }

        const [existingVotes] = await connection.query(
            `SELECT pv.id FROM poll_votes pv
             JOIN poll_options po ON pv.poll_option_id = po.id
             WHERE po.poll_id = ? AND pv.user_id = ?`,
            [option.poll_id, userId]
        );
        if (existingVotes.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: 'User has already voted on this poll.' });
        }
        
        await connection.query('INSERT INTO poll_votes (poll_option_id, user_id) VALUES (?, ?)', [optionId, userId]);
        await connection.commit();
        res.status(201).json({ message: 'Vote recorded.' });
    } catch (error) {
        await connection.rollback();
        console.error('Poll Vote Error:', error);
        res.status(500).json({ message: 'Server error' });
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

// @desc    Send a tip to a post's creator
// @route   POST /api/posts/:id/tip
// @access  Private
router.post('/:id/tip', protect, async (req, res) => {
    const { amount } = req.body;
    const postId = req.params.id;
    const senderId = req.user.id;
    const io = req.app.get('io');
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid tip amount.' });
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [[sender]] = await connection.query('SELECT wallet_balance FROM users WHERE id = ?', [senderId]);

        if (!sender || sender.wallet_balance < amount) {
            await connection.rollback();
            return res.status(400).json({ message: 'Insufficient funds.' });
        }

        const [[post]] = await connection.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
        if (!post) {
            await connection.rollback();
            return res.status(404).json({ message: 'Post not found.' });
        }
        const receiverId = post.user_id;

        if (senderId === receiverId) {
            await connection.rollback();
            return res.status(400).json({ message: "You cannot tip your own post." });
        }

        // Perform transaction
        await connection.query('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?', [amount, senderId]);
        await connection.query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [amount, receiverId]);
        await connection.query(
            'INSERT INTO transactions (sender_id, receiver_id, post_id, amount, type) VALUES (?, ?, ?, ?, ?)',
            [senderId, receiverId, postId, amount, 'tip']
        );
        
        // Notification for the receiver
        const [notifResult] = await connection.query(
            'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
            [receiverId, senderId, 'tip_post', postId]
        );
        const [newNotif] = await connection.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar FROM notifications n JOIN users u ON n.actor_id = u.id WHERE n.id = ?', [notifResult.insertId]);

        const targetSocket = getSocketFromUserId(receiverId);
        if (targetSocket) {
            targetSocket.emit('new_notification', newNotif[0]);
        }

        await connection.commit();
        res.json({ message: `Successfully tipped $${amount}` });
    } catch (error) {
        await connection.rollback();
        console.error('Tip Error:', error);
        res.status(500).json({ message: 'Server error during transaction.' });
    } finally {
        connection.release();
    }
});


export default router;