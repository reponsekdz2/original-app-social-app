import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

export default (upload) => {
    // GET /api/messages/conversations
    router.get('/conversations', isAuthenticated, async (req, res) => {
        const userId = req.session.userId;
        try {
            const [conversations] = await pool.query(`
                SELECT c.id, c.is_group, c.group_name
                FROM conversations c
                JOIN conversation_participants cp ON c.id = cp.conversation_id
                WHERE cp.user_id = ?
            `, [userId]);

            for (const convo of conversations) {
                const [participants] = await pool.query(`
                    SELECT u.id, u.username, u.name, u.avatar_url
                    FROM users u
                    JOIN conversation_participants cp ON u.id = cp.user_id
                    WHERE cp.conversation_id = ?
                `, [convo.id]);
                convo.participants = participants;

                const [messages] = await pool.query(`
                    SELECT m.*, u.username as senderUsername, u.avatar_url as senderAvatar 
                    FROM messages m
                    JOIN users u ON m.sender_id = u.id
                    WHERE m.conversation_id = ? 
                    ORDER BY m.created_at DESC 
                    LIMIT 30
                `, [convo.id]);
                convo.messages = messages.reverse();
            }

            res.json(conversations);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // POST /api/messages
    router.post('/', isAuthenticated, upload.single('attachment'), async (req, res) => {
        const { content, type, conversationId, recipientId, contentId, contentType, replyToMessageId } = req.body;
        const senderId = req.session.userId;
        const io = req.app.get('io');
        const file = req.file;

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            let finalConversationId = conversationId;

            // Handle creating a new 1-on-1 conversation
            if (!conversationId && recipientId) {
                // Check if a conversation between these two users already exists
                const [existingConvo] = await connection.query(`
                    SELECT conversation_id FROM conversation_participants cp
                    WHERE cp.is_group = 0 AND cp.user_id IN (?, ?)
                    GROUP BY cp.conversation_id
                    HAVING COUNT(DISTINCT cp.user_id) = 2
                `, [senderId, recipientId]);

                if (existingConvo.length > 0) {
                    finalConversationId = existingConvo[0].conversation_id;
                } else {
                    const [convoResult] = await connection.query('INSERT INTO conversations (is_group) VALUES (0)');
                    finalConversationId = convoResult.insertId;
                    await connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)', [finalConversationId, senderId, finalConversationId, recipientId]);
                }
            }
            
            if (!finalConversationId) {
                throw new Error("Conversation ID is missing");
            }

            let messageContent = content;
            let fileAttachment = null;
            if (file) {
                const filePath = `/uploads/attachments/${file.filename}`;
                if(type === 'image') {
                    messageContent = filePath;
                } else {
                     fileAttachment = JSON.stringify({
                        fileName: file.originalname,
                        fileSize: file.size,
                        fileUrl: filePath,
                    });
                }
            }

            const [result] = await connection.query(
                'INSERT INTO messages (conversation_id, sender_id, content, message_type, shared_content_id, shared_content_type, reply_to_message_id, file_attachment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [finalConversationId, senderId, messageContent, type, contentId || null, contentType || null, replyToMessageId || null, fileAttachment]
            );

            await connection.commit();
            
            // Fetch the full message object to send back and emit
            const [[newMessage]] = await pool.query('SELECT m.*, u.username as senderUsername FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?', [result.insertId]);

            // Emit to all participants in the conversation
            const [participants] = await pool.query('SELECT user_id FROM conversation_participants WHERE conversation_id = ?', [finalConversationId]);
            participants.forEach(p => {
                io.to(p.user_id).emit('receive_message', newMessage);
            });
            
            res.status(201).json(newMessage);

        } catch (error) {
            await connection.rollback();
            console.error("Error sending message:", error);
            res.status(500).json({ message: 'Failed to send message' });
        } finally {
            connection.release();
        }
    });

    // POST /api/messages/group
    router.post('/group', isAuthenticated, async (req, res) => {
        const { name, userIds } = req.body;
        const creatorId = req.session.userId;
        const allParticipantIds = [...new Set([creatorId, ...userIds])];

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [convoResult] = await connection.query(
                'INSERT INTO conversations (is_group, group_name) VALUES (1, ?)',
                [name]
            );
            const conversationId = convoResult.insertId;

            const participantsData = allParticipantIds.map(userId => [conversationId, userId]);
            await connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?', [participantsData]);

            await connection.commit();
            // Fetch the full conversation to return
            const newConvo = { id: conversationId, name, participants: allParticipantIds, isGroup: true, messages: [] };
            res.status(201).json(newConvo);
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ message: 'Failed to create group' });
        } finally {
            connection.release();
        }
    });

    // PUT /api/messages/group/:id
    router.put('/group/:id', isAuthenticated, async (req, res) => {
        const { id: conversationId } = req.params;
        const { name, addUserIds } = req.body;

        try {
            if (name) {
                await pool.query('UPDATE conversations SET group_name = ? WHERE id = ?', [name, conversationId]);
            }
            if (addUserIds && addUserIds.length > 0) {
                const participantsData = addUserIds.map(userId => [conversationId, userId]);
                await pool.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?', [participantsData]);
            }
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update group' });
        }
    });

    return router;
};
