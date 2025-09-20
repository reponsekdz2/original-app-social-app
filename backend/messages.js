import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import { getSocketFromUserId } from './socket.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// --- Multer Setup for File Attachments ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/attachments/');
    },
    filename: function (req, file, cb) {
        cb(null, `attachment-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

const getParticipants = async (connection, conversationId) => {
    const [participants] = await connection.query(
        `SELECT u.id, u.username, u.name, u.avatar_url as avatar, u.is_verified
         FROM conversation_participants cp
         JOIN users u ON cp.user_id = u.id
         WHERE cp.conversation_id = ?`,
        [conversationId]
    );
    return participants;
}

// @desc    Get all conversations for the current user
// @route   GET /api/messages
// @access  Private
router.get('/', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [userConvoIds] = await pool.query(
            `SELECT c.id, c.is_group, c.name, cs.theme, cs.vanish_mode_enabled 
             FROM conversations c
             JOIN conversation_participants cp ON c.id = cp.conversation_id
             LEFT JOIN conversation_settings cs ON c.id = cs.conversation_id
             WHERE cp.user_id = ?`,
            [userId]
        );

        const fullConversations = await Promise.all(userConvoIds.map(async (convo) => {
            const participants = await getParticipants(pool, convo.id);
            
            const [messages] = await pool.query(
                `SELECT 
                    m.id, m.sender_id as senderId, m.content, m.created_at as timestamp, m.message_type as type, m.read_at as 'read',
                    m.shared_content_id, m.shared_content_type, m.file_name, m.file_size, m.file_url, m.file_type
                 FROM messages m WHERE m.conversation_id = ? ORDER BY m.created_at ASC`,
                [convo.id]
            );
            
            const processedMessages = await Promise.all(messages.map(async (msg) => {
                let sharedContent = null, fileAttachment = null;
                if ((msg.type === 'share_post' || msg.type === 'share_reel') && msg.shared_content_id) {
                     // In a real app, you'd fetch the details of the shared post/reel here
                }
                if (msg.type === 'file' || msg.type === 'image') {
                    fileAttachment = { fileName: msg.file_name, fileSize: msg.file_size, fileUrl: msg.file_url, fileType: msg.file_type };
                }
                return { ...msg, reactions: [], sharedContent, fileAttachment };
            }));

            return {
                id: convo.id,
                isGroup: !!convo.is_group,
                name: convo.name,
                participants,
                messages: processedMessages,
                settings: {
                    theme: convo.theme || 'default',
                    vanish_mode_enabled: !!convo.vanish_mode_enabled,
                }
            };
        }));
        
        res.json(fullConversations);
    } catch (error) {
        console.error('Get Conversations Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Send a new message or start a conversation
// @route   POST /api/messages
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
    const { recipientId, conversationId: existingConvoId, content, type, sharedContentId, contentType } = req.body;
    const senderId = req.user.id;
    const io = req.app.get('io');

    if ((!recipientId && !existingConvoId) || !type) {
        return res.status(400).json({ message: 'Recipient/Conversation ID and message type are required.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        let conversationId = existingConvoId;
        
        if (!conversationId && recipientId) {
            const [convos] = await connection.query(
                `SELECT cp1.conversation_id FROM conversation_participants cp1
                 JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
                 JOIN conversations c ON cp1.conversation_id = c.id
                 WHERE cp1.user_id = ? AND cp2.user_id = ? AND c.is_group = FALSE`,
                [senderId, recipientId]
            );
            if (convos.length > 0) {
                conversationId = convos[0].conversation_id;
            } else {
                const [newConvo] = await connection.query('INSERT INTO conversations (is_group, created_by) VALUES (FALSE, ?)', [senderId]);
                conversationId = newConvo.insertId;
                await connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)', [conversationId, senderId, conversationId, recipientId]);
            }
        }
        
        let file_name = null, file_size = null, file_url = null, file_type = null;
        let messageContent = content || '';

        if (req.file) {
            file_name = req.file.originalname;
            file_size = req.file.size;
            file_url = `/uploads/attachments/${req.file.filename}`;
            file_type = req.file.mimetype;
            if (type === 'image') messageContent = file_url;
        }

        const [msgResult] = await connection.query(
            'INSERT INTO messages (conversation_id, sender_id, content, message_type, shared_content_id, shared_content_type, file_name, file_size, file_url, file_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [conversationId, senderId, messageContent, type, sharedContentId || null, contentType || null, file_name, file_size, file_url, file_type]
        );
        const messageId = msgResult.insertId;
        
        await connection.commit();
        
        const [msgRows] = await connection.query('SELECT *, sender_id as senderId, read_at as `read` FROM messages WHERE id = ?', [messageId]);
        const dbMessage = msgRows[0];
        
        const messageToEmit = {
            ...dbMessage,
            reactions: [],
            fileAttachment: (dbMessage.file_url) ? { fileName: dbMessage.file_name, fileSize: dbMessage.file_size, fileUrl: dbMessage.file_url, fileType: dbMessage.file_type } : null,
        };

        const participants = await getParticipants(connection, conversationId);
        
        participants.forEach(p => {
            const socket = getSocketFromUserId(p.id);
            if (socket) {
                const event = String(p.id) === String(senderId) ? 'message_sent_confirmation' : 'receive_message';
                socket.emit(event, { conversationId, message: messageToEmit });
            }
        });

        res.status(201).json(messageToEmit);

    } catch (error) {
        await connection.rollback();
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error while sending message.' });
    } finally {
        connection.release();
    }
});

// @desc    Create a new group chat
// @route   POST /api/messages/group
// @access  Private
router.post('/group', protect, async (req, res) => {
    const { name, userIds } = req.body;
    const creatorId = req.user.id;
    if (!name || !userIds || userIds.length < 1) {
        return res.status(400).json({ message: 'Group name and at least one other member are required.' });
    }
    const allParticipantIds = [...new Set([creatorId, ...userIds])];

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [convoResult] = await connection.query(
            'INSERT INTO conversations (name, is_group, created_by) VALUES (?, TRUE, ?)',
            [name, creatorId]
        );
        const conversationId = convoResult.insertId;
        
        const participantPromises = allParticipantIds.map(userId => {
            return connection.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)', [conversationId, userId]);
        });
        await Promise.all(participantPromises);
        await connection.commit();
        
        const participants = await getParticipants(connection, conversationId);
        const newConversation = {
            id: conversationId, name, isGroup: true, messages: [], participants,
            settings: { theme: 'default', vanish_mode_enabled: false }
        };
        res.status(201).json(newConversation);
    } catch (error) {
        await connection.rollback();
        console.error('Create Group Error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// @desc    Update conversation settings (theme, vanish mode)
// @route   PUT /api/messages/:id/settings
// @access  Private
router.put('/:id/settings', protect, async (req, res) => {
    const conversationId = req.params.id;
    const { theme, vanish_mode_enabled } = req.body;
    
    try {
        await pool.query(
            `INSERT INTO conversation_settings (conversation_id, theme, vanish_mode_enabled)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                theme = VALUES(theme), 
                vanish_mode_enabled = VALUES(vanish_mode_enabled)`,
            [conversationId, theme, vanish_mode_enabled]
        );
        res.json({ message: 'Settings updated' });
    } catch (error) {
        console.error('Update Convo Settings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;