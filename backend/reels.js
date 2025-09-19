import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import { getSocketByUserId } from './socket.js';

const router = Router();

// Fix: Add GET / route to fetch reels for the feed
// @desc    Get reels for the feed
// @route   GET /api/reels
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const [reels] = await pool.query(`
            SELECT 
                r.id, 
                r.video_url as video, 
                r.caption, 
                r.created_at as timestamp,
                JSON_OBJECT('id', u.id, 'username', u.username, 'name', u.name, 'avatar', u.avatar_url, 'is_verified', u.is_verified) as user,
                (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) as likes,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('id', lu.id, 'username', lu.username, 'name', lu.name, 'avatar', lu.avatar_url)
                ) FROM reel_likes rl JOIN users lu ON rl.user_id = lu.id WHERE rl.reel_id = r.id) as likedBy,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('id', c.id, 'text', c.text, 'timestamp', c.created_at, 'user', JSON_OBJECT('id', cu.id, 'username', cu.username, 'avatar', cu.avatar_url))
                ) FROM comments c JOIN users cu ON c.user_id = cu.id WHERE c.reel_id = r.id) as comments,
                (SELECT COUNT(*) FROM reel_shares WHERE reel_id = r.id) as shares
            FROM reels r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
            LIMIT 20
        `);
        // The JSON_ARRAYAGG will return NULL for empty arrays, so we need to convert them to []
        const processedReels = reels.map(reel => ({
            ...reel,
            likedBy: reel.likedBy || [],
            comments: reel.comments || []
        }));
        res.json(processedReels);
    } catch (error) {
        console.error('Get Reels Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Toggle like on a reel
// @route   POST /api/reels/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    const reelId = req.params.id;
    const userId = req.user.id;
    const io = req.app.get('io');
    
    try {
        const [existingLike] = await pool.query('SELECT * FROM reel_likes WHERE reel_id = ? AND user_id = ?', [reelId, userId]);
        
        if (existingLike.length > 0) {
            await pool.query('DELETE FROM reel_likes WHERE reel_id = ? AND user_id = ?', [reelId, userId]);
            res.json({ message: 'Reel unliked successfully' });
        } else {
            await pool.query('INSERT INTO reel_likes (reel_id, user_id) VALUES (?, ?)', [reelId, userId]);
            
            // --- Create and Emit Notification ---
            const [reelOwner] = await pool.query('SELECT user_id FROM reels WHERE id = ?', [reelId]);
            if (reelOwner.length > 0 && reelOwner[0].user_id !== userId) {
                 const [notifResult] = await pool.query(
                    'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                    [reelOwner[0].user_id, userId, 'like_reel', reelId]
                );
                 const [newNotif] = await pool.query('SELECT * FROM notifications WHERE id = ?', [notifResult.insertId]);

                const targetSocket = getSocketByUserId(io, reelOwner[0].user_id);
                if (targetSocket) {
                    targetSocket.emit('new_notification', newNotif[0]);
                }
            }

            res.json({ message: 'Reel liked successfully' });
        }
    } catch (error) {
        console.error('Toggle Reel Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Add a comment to a reel
// @route   POST /api/reels/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
    const reelId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;
    const io = req.app.get('io');

    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    try {
        const [result] = await pool.query('INSERT INTO comments (reel_id, user_id, text) VALUES (?, ?, ?)', [reelId, userId, text]);
        
        // --- Create and Emit Notification ---
        const [reelOwner] = await pool.query('SELECT user_id FROM reels WHERE id = ?', [reelId]);
        if (reelOwner.length > 0 && reelOwner[0].user_id !== userId) {
             const [notifResult] = await pool.query(
                'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                [reelOwner[0].user_id, userId, 'comment_reel', reelId]
            );
            const [newNotif] = await pool.query('SELECT * FROM notifications WHERE id = ?', [notifResult.insertId]);

            const targetSocket = getSocketByUserId(io, reelOwner[0].user_id);
            if (targetSocket) {
                targetSocket.emit('new_notification', newNotif[0]);
            }
        }
        
        const [newComment] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
        res.status(201).json(newComment[0]);
    } catch (error) {
        console.error('Add Reel Comment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;