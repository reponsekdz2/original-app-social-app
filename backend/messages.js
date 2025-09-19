import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

// @desc    Send a new message or start a conversation
// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res) => {
    const { recipientId, content, type, sharedContentId } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !content || !type) {
        return res.status(400).json({ message: 'Recipient, content, and type are required.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Find if a conversation already exists between the two users
        const [conversations] = await connection.query(
            `SELECT cp1.conversation_id 
             FROM conversation_participants cp1
             JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
             WHERE cp1.user_id = ? AND cp2.user_id = ?`,
            [senderId, recipientId]
        );

        let conversationId;
        if (conversations.length > 0) {
            conversationId = conversations[0].conversation_id;
        } else {
            // Create a new conversation
            const [newConvoResult] = await connection.query('INSERT INTO conversations () VALUES ()');
            conversationId = newConvoResult.insertId;
            // Add both users as participants
            await connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)', [conversationId, senderId, conversationId, recipientId]);
        }
        
        // Construct the message content
        let messageContent = content;
        if (type === 'share_post' || type === 'share_reel') {
            messageContent = JSON.stringify({ text: content, sharedContentId });
        }

        // Insert the new message
        const [messageResult] = await connection.query(
            'INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES (?, ?, ?, ?)',
            [conversationId, senderId, messageContent, type]
        );
        const messageId = messageResult.insertId;
        
        await connection.commit();
        
        // Fetch the full new message to return and emit
        const [newMessageRows] = await connection.query('SELECT * FROM messages WHERE id = ?', [messageId]);

        // Emit the message via Socket.IO
        const io = req.app.get('io');
        // A more robust implementation would look up socket IDs for both users
        io.emit('receive_message', { conversationId, message: newMessageRows[0] });

        res.status(201).json(newMessageRows[0]);

    } catch (error) {
        await connection.rollback();
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error while sending message.' });
    } finally {
        connection.release();
    }
});

export default router;
