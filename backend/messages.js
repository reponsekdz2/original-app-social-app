import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

export default (upload) => {
    // GET /api/messages/conversations
    router.get('/conversations', isAuthenticated, async (req, res) => {
        try {
            const [conversations] = await pool.query(`
                SELECT c.*, c.group_name as name FROM conversations c
                JOIN conversation_participants cp ON c.id = cp.conversation_id
                WHERE cp.user_id = ?
                ORDER BY (SELECT MAX(created_at) FROM messages WHERE conversation_id = c.id) DESC
            `, [req.session.userId]);

            for (const convo of conversations) {
                const [participants] = await pool.query(`
                    SELECT u.id, u.username, u.name, u.avatar_url, u.is_verified 
                    FROM users u 
                    JOIN conversation_participants cp ON u.id = cp.user_id 
                    WHERE cp.conversation_id = ?`, [convo.id]);
                convo.participants = participants;

                const [messages] = await pool.query(`
                    SELECT m.*, m.sender_id as senderId, m.message_type as type, m.created_at as timestamp, m.file_attachment 
                    FROM messages m 
                    WHERE m.conversation_id = ? ORDER BY m.created_at ASC`, [convo.id]);
                
                convo.messages = messages.map(m => ({
                    ...m,
                    fileAttachment: m.file_attachment ? JSON.parse(m.file_attachment) : null
                }));
            }

            res.json(conversations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // POST /api/messages - Send a new message
    router.post('/', isAuthenticated, upload.single('media'), async (req, res) => {
        const { content, type, conversationId, recipientId, sharedContentId, sharedContentType } = req.body;
        const senderId = req.session.userId;

        let finalContent = content;
        let fileAttachment = null;

        if (req.file) {
            const fileUrl = `/uploads/${req.file.filename}`;
            if (type === 'file') {
                fileAttachment = JSON.stringify({
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    fileUrl: fileUrl,
                    fileType: req.file.mimetype,
                });
                finalContent = "File Attachment"; 
            } else {
                // For images, etc.
                finalContent = fileUrl;
            }
        }
        
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            let convoId = conversationId;
            // If it's a new 1-on-1 chat
            if (!convoId && recipientId) {
                // Check if a conversation already exists
                const [existingConvo] = await connection.query(`
                    SELECT conversation_id FROM conversation_participants cp1
                    JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
                    WHERE cp1.user_id = ? AND cp2.user_id = ? AND (SELECT is_group FROM conversations WHERE id = cp1.conversation_id) = 0
                `, [senderId, recipientId]);
                
                if (existingConvo.length > 0) {
                    convoId = existingConvo[0].conversation_id;
                } else {
                    const [newConvoResult] = await connection.query('INSERT INTO conversations (is_group) VALUES (0)');
                    convoId = newConvoResult.insertId;
                    await connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)', [convoId, senderId, convoId, recipientId]);
                }
            }

            if (!convoId) {
                throw new Error("Conversation ID or Recipient ID is required.");
            }
            
            let sharedId = null;
            if (sharedContentId && sharedContentType) {
                sharedId = sharedContentId; // In a real app, you might create a link record
            }

            const [result] = await connection.query(
                'INSERT INTO messages (conversation_id, sender_id, content, message_type, shared_content_id, file_attachment) VALUES (?, ?, ?, ?, ?, ?)',
                [convoId, senderId, finalContent, type, sharedId, fileAttachment]
            );
            
            await connection.commit();

            const [[newMessageData]] = await pool.query('SELECT *, conversation_id, sender_id as senderId, message_type as type, created_at as timestamp, file_attachment FROM messages WHERE id = ?', [result.insertId]);

            const newMessage = {
                ...newMessageData,
                fileAttachment: newMessageData.file_attachment ? JSON.parse(newMessageData.file_attachment) : null,
            };
            delete newMessage.file_attachment;


            // Real-time notification via Socket.IO
            const io = req.app.get('io');
            const [participants] = await pool.query('SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id != ?', [convoId, senderId]);
            participants.forEach(participant => {
                io.to(participant.user_id).emit('receive_message', newMessage);
            });
            
            res.status(201).json(newMessage);

        } catch (error) {
            await connection.rollback();
            console.error("Error sending message:", error);
            res.status(500).json({ message: "Failed to send message." });
        } finally {
            connection.release();
        }
    });
    
    // POST /api/messages/conversations/group - Create a group chat
    router.post('/conversations/group', isAuthenticated, async (req, res) => {
        const { name, userIds } = req.body; // userIds is an array of other user IDs
        const creatorId = req.session.userId;

        if (!name || !userIds || userIds.length === 0) {
            return res.status(400).json({ message: "Group name and participants are required." });
        }
        
        const allParticipantIds = [...new Set([creatorId, ...userIds])];
        
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const [convoResult] = await connection.query('INSERT INTO conversations (is_group, group_name) VALUES (1, ?)', [name]);
            const convoId = convoResult.insertId;

            const participantValues = allParticipantIds.map(id => [convoId, id]);
            await connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?', [participantValues]);

            await connection.commit();
            
            // Fetch the newly created group to return it
            const [newGroupData] = await pool.query('SELECT *, group_name as name FROM conversations WHERE id = ?', [convoId]);
            const newGroup = newGroupData[0];
            const [participants] = await pool.query('SELECT id, username, name, avatar_url FROM users WHERE id IN (?)', [allParticipantIds]);
            newGroup.participants = participants;
            newGroup.messages = [];
            
            res.status(201).json(newGroup);

        } catch(error) {
            await connection.rollback();
            console.error("Failed to create group:", error);
            res.status(500).json({ message: "Internal server error" });
        } finally {
            connection.release();
        }
    });


    return router;
};