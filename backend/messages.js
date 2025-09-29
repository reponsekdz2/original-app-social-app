import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

export default (upload) => {
    // Other message routes...

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