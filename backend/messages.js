import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import { getSocketFromUserId } from './socket.js';

const router = Router();

// A helper to get the conversation's other participant details
const getOtherParticipant = async (connection, conversationId, currentUserId) => {
    const [participants] = await connection.query(
        `SELECT u.id, u.username, u.name, u.avatar_url as avatar, u.is_verified
         FROM conversation_participants cp
         JOIN users u ON cp.user_id = u.id
         WHERE cp.conversation_id = ? AND cp.user_id != ?`,
        [conversationId, currentUserId]
    );
    return participants[0];
};

// @desc    Get all conversations for the current user
// @route   GET /api/messages
// @access  Private
router.get('/', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [userConvoIds] = await pool.query(
            `SELECT conversation_id as id FROM conversation_participants WHERE user_id = ?`,
            [userId]
        );

        const fullConversations = await Promise.all(userConvoIds.map(async (convo) => {
            const otherUser = await getOtherParticipant(pool, convo.id, userId);
            
            const [messages] = await pool.query(
                `SELECT 
                    m.id, 
                    m.sender_id as senderId, 
                    m.content, 
                    m.created_at as timestamp, 
                    m.message_type as type,
                    m.shared_content_id,
                    m.shared_content_type
                 FROM messages m
                 WHERE m.conversation_id = ? 
                 ORDER BY m.created_at ASC`,
                [convo.id]
            );
            
            const processedMessages = await Promise.all(messages.map(async (msg) => {
                let sharedContent = null;
                if ((msg.type === 'share_post' || msg.type === 'share_reel') && msg.shared_content_id) {
                    let contentQuery, contentResult;
                    if (msg.shared_content_type === 'post') {
                        contentQuery = `
                            SELECT p.caption, (SELECT pm.media_url FROM post_media pm WHERE pm.post_id = p.id LIMIT 1) as media_url, u.username, u.avatar_url as avatar_url
                            FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`;
                        [contentResult] = await pool.query(contentQuery, [msg.shared_content_id]);
                    } else { // reel
                        contentQuery = `
                            SELECT r.caption, r.video_url as media_url, u.username, u.avatar_url as avatar_url
                            FROM reels r JOIN users u ON r.user_id = u.id WHERE r.id = ?`;
                        [contentResult] = await pool.query(contentQuery, [msg.shared_content_id]);
                    }
                    if (contentResult.length > 0) {
                        sharedContent = {
                            id: msg.shared_content_id,
                            type: msg.shared_content_type,
                            ...contentResult[0]
                        };
                    }
                }
                // Mock reactions for now
                return { ...msg, reactions: [], sharedContent };
            }));

            return {
                id: convo.id,
                participants: [req.user, otherUser],
                messages: processedMessages,
            };
        }));
        
        res.json(fullConversations.filter(c => c.participants.length > 1 && c.participants[1]));
    } catch (error) {
        console.error('Get Conversations Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Send a new message or start a conversation
// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res) => {
    const { recipientId, content, type, sharedContentId, contentType } = req.body;
    const senderId = req.user.id;

    if (!recipientId || (content === undefined && !sharedContentId)) {
        return res.status(400).json({ message: 'Recipient and content are required.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [conversations] = await connection.query(
            `SELECT cp1.conversation_id FROM conversation_participants cp1
             JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
             WHERE cp1.user_id = ? AND cp2.user_id = ?`,
            [senderId, recipientId]
        );

        let conversationId;
        if (conversations.length > 0) {
            conversationId = conversations[0].conversation_id;
        } else {
            const [newConvoResult] = await connection.query('INSERT INTO conversations () VALUES ()');
            conversationId = newConvoResult.insertId;
            await connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)', [conversationId, senderId, conversationId, recipientId]);
        }
        
        const [messageResult] = await connection.query(
            'INSERT INTO messages (conversation_id, sender_id, content, message_type, shared_content_id, shared_content_type) VALUES (?, ?, ?, ?, ?, ?)',
            [conversationId, senderId, content || '', type, sharedContentId || null, contentType || null]
        );
        const messageId = messageResult.insertId;
        
        await connection.commit();
        
        const [newMessageRows] = await connection.query('SELECT id, sender_id as senderId, content, created_at as timestamp, message_type as type, shared_content_id, shared_content_type FROM messages WHERE id = ?', [messageId]);
        const fullMessage = newMessageRows[0];

        // Process message for socket emission (resolve shared content)
        let messageToEmit = { ...fullMessage, reactions: [] };
        if ((type === 'share_post' || type === 'share_reel') && sharedContentId) {
             let contentQuery, contentResult;
             if (contentType === 'post') {
                 contentQuery = `SELECT p.caption, (SELECT pm.media_url FROM post_media pm WHERE pm.post_id = p.id LIMIT 1) as media_url, u.username, u.avatar_url as avatar_url FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`;
                 [contentResult] = await connection.query(contentQuery, [sharedContentId]);
             } else { // reel
                 contentQuery = `SELECT r.caption, r.video_url as media_url, u.username, u.avatar_url as avatar_url FROM reels r JOIN users u ON r.user_id = u.id WHERE r.id = ?`;
                 [contentResult] = await connection.query(contentQuery, [sharedContentId]);
             }
             if(contentResult.length > 0) {
                 messageToEmit.sharedContent = {
                     id: sharedContentId,
                     type: contentType,
                     ...contentResult[0]
                 };
             }
        }
        
        const senderSocket = getSocketFromUserId(senderId);
        const recipientSocket = getSocketFromUserId(recipientId);

        const payload = { conversationId, message: messageToEmit };
        
        // Emit to recipient first
        if (recipientSocket) {
             recipientSocket.emit('receive_message', payload);
        }
        
        // Emit back to sender for confirmation and UI update
        if (senderSocket) {
             senderSocket.emit('message_sent_confirmation', payload);
        }

        res.status(201).json(messageToEmit);

    } catch (error) {
        await connection.rollback();
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error while sending message.' });
    } finally {
        connection.release();
    }
});

export default router;
