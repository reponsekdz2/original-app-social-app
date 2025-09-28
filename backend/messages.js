import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

const hydrateSharedContent = async (message) => {
    if (!message.shared_content_id || !message.shared_content_type) {
        return null;
    }
    try {
        if (message.shared_content_type === 'post') {
            const [[post]] = await pool.query(`
                SELECT 
                    p.id, 
                    (SELECT media_url FROM post_media WHERE post_id = p.id ORDER BY sort_order ASC LIMIT 1) as media_url,
                    u.username, u.avatar_url
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = ?`, [message.shared_content_id]);
            return post ? { type: 'post', id: post.id, media_url: post.media_url, username: post.username, avatar_url: post.avatar_url } : null;
        } else if (message.shared_content_type === 'reel') {
            const [[reel]] = await pool.query(`
                SELECT 
                    r.id, r.video_url as media_url, u.username, u.avatar_url
                FROM reels r
                JOIN users u ON r.user_id = u.id
                WHERE r.id = ?`, [message.shared_content_id]);
            return reel ? { type: 'reel', id: reel.id, media_url: reel.media_url, username: reel.username, avatar_url: reel.avatar_url } : null;
        }
    } catch (e) {
        console.error("Error hydrating shared content:", e);
        return null;
    }
    return null;
};

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

            if (conversations.length === 0) {
                return res.json([]);
            }

            for (const convo of conversations) {
                const [participants] = await pool.query(`
                    SELECT u.id, u.username, u.name, u.avatar_url, u.is_verified 
                    FROM users u 
                    JOIN conversation_participants cp ON u.id = cp.user_id 
                    WHERE cp.conversation_id = ?`, [convo.id]);
                convo.participants = participants;
                convo.settings = {
                    theme: convo.theme,
                    vanish_mode_enabled: !!convo.vanish_mode_enabled
                };

                const [messages] = await pool.query(`
                    SELECT m.*, m.sender_id as senderId, m.message_type as type, m.created_at as timestamp, m.file_attachment,
                           r.content as reply_to_content, r_sender.username as reply_to_sender_username
                    FROM messages m 
                    LEFT JOIN messages r ON m.reply_to_message_id = r.id
                    LEFT JOIN users r_sender ON r.sender_id = r_sender.id
                    WHERE m.conversation_id = ? ORDER BY m.created_at ASC`, [convo.id]);
                
                const messageIds = messages.map(m => m.id);
                const reactions = messageIds.length > 0 ? (await pool.query(`
                    SELECT mr.message_id, mr.emoji, u.id as user_id, u.username, u.avatar_url 
                    FROM message_reactions mr JOIN users u ON mr.user_id = u.id WHERE mr.message_id IN (?)
                `, [messageIds]))[0] : [];
                
                const hydratedMessages = [];
                for(const m of messages) {
                    hydratedMessages.push({
                        ...m,
                        fileAttachment: m.file_attachment ? JSON.parse(m.file_attachment) : null,
                        reactions: reactions.filter(r => r.message_id === m.id).map(r => ({ emoji: r.emoji, user: { id: r.user_id, username: r.username, avatar_url: r.avatar_url } })),
                        replyTo: m.reply_to_message_id ? { content: m.reply_to_content, sender: m.reply_to_sender_username } : null,
                        sharedContent: await hydrateSharedContent(m)
                    })
                }
                convo.messages = hydratedMessages;
            }

            res.json(conversations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // POST /api/messages - Send a new message
    router.post('/', isAuthenticated, upload.single('media'), async (req, res) => {
        const { content, type, conversationId, recipientId, sharedContentId, sharedContentType, replyToMessageId } = req.body;
        const senderId = req.session.userId;

        let finalContent = content;
        let fileAttachment = null;

        if (req.file) {
            const fileUrl = `/uploads/${req.file.filename}`;
            if (type === 'file' || type === 'voicenote') {
                fileAttachment = JSON.stringify({
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    fileUrl: fileUrl,
                    fileType: req.file.mimetype,
                });
                finalContent = type === 'voicenote' ? "Voice Note" : "File Attachment"; 
            } else {
                finalContent = fileUrl;
            }
        }
        
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            let convoId = conversationId;
            if (!convoId && recipientId) {
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

            if (!convoId) throw new Error("Conversation ID or Recipient ID is required.");
            
            const [result] = await connection.query(
                'INSERT INTO messages (conversation_id, sender_id, content, message_type, shared_content_id, shared_content_type, reply_to_message_id, file_attachment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [convoId, senderId, finalContent, type, sharedContentId || null, sharedContentType || null, replyToMessageId || null, fileAttachment]
            );
            
            await connection.commit();

            const [[newMessageData]] = await pool.query('SELECT *, conversation_id, sender_id as senderId, message_type as type, created_at as timestamp FROM messages WHERE id = ?', [result.insertId]);
            
            const newMessage = { ...newMessageData, fileAttachment: fileAttachment ? JSON.parse(fileAttachment) : null, reactions: [], replyTo: null, sharedContent: await hydrateSharedContent(newMessageData) };

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

    // POST /api/messages/:id/react
    router.post('/:id/react', isAuthenticated, async (req, res) => {
        const { id: messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.session.userId;

        try {
            // Atomically insert or update the reaction
            await pool.query(
                `INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE emoji = ?`,
                [messageId, userId, emoji, emoji]
            );
            // In a real app you might want to notify clients via sockets about the new reaction
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    // POST /api/messages/conversations/group - Create a group chat
    router.post('/conversations/group', isAuthenticated, async (req, res) => {
        const { name, userIds } = req.body;
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
    
    // PUT /api/messages/conversations/:id/settings
    router.put('/conversations/:id/settings', isAuthenticated, async (req, res) => {
        const { id } = req.params;
        const { theme, vanish_mode_enabled } = req.body;
        
        try {
            const fieldsToUpdate = [];
            const values = [];
            if (theme !== undefined) {
                fieldsToUpdate.push('theme = ?');
                values.push(theme);
            }
            if (vanish_mode_enabled !== undefined) {
                fieldsToUpdate.push('vanish_mode_enabled = ?');
                values.push(vanish_mode_enabled);
            }

            if (fieldsToUpdate.length === 0) {
                return res.status(400).json({ message: "No settings provided to update." });
            }

            values.push(id);
            await pool.query(`UPDATE conversations SET ${fieldsToUpdate.join(', ')} WHERE id = ?`, values);
            res.sendStatus(200);
        } catch(error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });


    return router;
};