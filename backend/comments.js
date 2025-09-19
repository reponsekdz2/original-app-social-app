import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import { getSocketByUserId } from './socket.js';

const router = Router();

// @desc    Toggle like on a comment
// @route   POST /api/comments/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;
    const io = req.app.get('io');

    try {
        const [existingLike] = await pool.query('SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
        
        if (existingLike.length > 0) {
            // Unlike
            await pool.query('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
            res.json({ message: 'Comment unliked successfully' });
        } else {
            // Like
            await pool.query('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
            
            // --- Create and Emit Notification ---
            const [commentOwner] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
            if (commentOwner.length > 0 && commentOwner[0].user_id !== userId) {
                 const [notifResult] = await pool.query(
                    'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                    [commentOwner[0].user_id, userId, 'like_comment', commentId]
                );
                const [newNotif] = await pool.query('SELECT n.*, u.username as actor_username, u.avatar_url as actor_avatar FROM notifications n JOIN users u ON n.actor_id = u.id WHERE n.id = ?', [notifResult.insertId]);

                const targetSocket = getSocketByUserId(io, commentOwner[0].user_id);
                if (targetSocket) {
                    targetSocket.emit('new_notification', newNotif[0]);
                }
            }

            res.json({ message: 'Comment liked successfully' });
        }
    } catch (error) {
        console.error('Toggle Comment Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;