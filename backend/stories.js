
import { Router } from 'express';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();

export default (upload) => {
    // GET /api/stories - Fetch stories for the main feed
    router.get('/', isAuthenticated, async (req, res) => {
        const userId = req.session.userId;
        try {
            const [storyUsers] = await pool.query(`
                SELECT DISTINCT
                    u.id as user_id,
                    u.username,
                    u.avatar_url,
                    s.created_at,
                    s.for_close_friends_only
                FROM stories s
                JOIN users u ON s.user_id = u.id
                WHERE
                    (s.user_id = ? OR s.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?))
                    AND s.created_at >= NOW() - INTERVAL 1 DAY
                    AND (
                        s.for_close_friends_only = 0
                        OR s.user_id = ?
                        OR (s.for_close_friends_only = 1 AND EXISTS (SELECT 1 FROM close_friends cf WHERE cf.user_id = s.user_id AND cf.friend_id = ?))
                    )
                ORDER BY (s.user_id = ?) DESC, s.created_at DESC;
            `, [userId, userId, userId, userId, userId]);

            const resultStories = [];
            for (const user of storyUsers) {
                const [items] = await pool.query(`
                    SELECT 
                        si.id, 
                        si.media_url, 
                        si.media_type as mediaType, 
                        si.duration_ms as duration,
                        si.created_at
                    FROM story_items si 
                    JOIN stories s ON si.story_id = s.id
                    WHERE s.user_id = ? AND s.created_at >= NOW() - INTERVAL 1 DAY
                    ORDER BY si.created_at ASC
                `, [user.user_id]);

                if (items.length > 0) {
                     resultStories.push({
                        id: `story_group_${user.user_id}`,
                        user: {
                            id: user.user_id,
                            username: user.username,
                            avatar_url: user.avatar_url,
                        },
                        items: items,
                        created_at: user.created_at,
                        for_close_friends_only: !!user.for_close_friends_only,
                    });
                }
            }
            res.json(resultStories);
        } catch (error) {
            console.error('Error fetching stories:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // POST /api/stories - Create a new story
    router.post('/', isAuthenticated, upload.single('media'), async (req, res) => {
        const file = req.file;
        const { forCloseFriendsOnly } = req.body;
        const userId = req.session.userId;

        if (!file) {
            return res.status(400).json({ message: 'Media file is required.' });
        }
        
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const isForCloseFriends = forCloseFriendsOnly === 'true';
            const [newStory] = await connection.query('INSERT INTO stories (user_id, for_close_friends_only) VALUES (?, ?)', [userId, isForCloseFriends]);
            const storyId = newStory.insertId;

            const mediaUrl = `/uploads/${file.filename}`;
            const mediaType = file.mimetype.startsWith('image') ? 'image' : 'video';
            
            await connection.query(
                'INSERT INTO story_items (story_id, media_url, media_type) VALUES (?, ?, ?)',
                [storyId, mediaUrl, mediaType]
            );

            await connection.commit();
            res.status(201).json({ message: 'Story created successfully' });
        } catch (error) {
            await connection.rollback();
            console.error('Error creating story:', error);
            res.status(500).json({ message: 'Failed to create story.' });
        } finally {
            connection.release();
        }
    });

    return router;
};