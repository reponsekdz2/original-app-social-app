import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import { getSocketFromUserId } from './socket.js';

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
            await pool.query('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
            res.json({ message: 'Comment unliked successfully' });
        } else {
            await pool.query('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
            
            // Send notification to the comment author
            const [commentOwner] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
            if (commentOwner.length > 0 && commentOwner[0].user_id !== userId) {
                 const [notifResult] = await pool.query(
                    'INSERT INTO notifications (user_id, actor_id, type, entity_id) VALUES (?, ?, ?, ?)',
                    [commentOwner[0].user_id, userId, 'like_comment', commentId]
                );
                //  const [newNotif] = await pool.query('SELECT ... complex query ...');
                // const targetSocket = getSocketFromUserId(commentOwner[0].user_id);
                // if (targetSocket) {
                //     targetSocket.emit('new_notification', newNotif[0]);
                // }
            }

            res.json({ message: 'Comment liked successfully' });
        }
    } catch (error) {
        console.error('Toggle Comment Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
