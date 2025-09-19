import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// --- Multer Setup for Story Uploads ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `story-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });


// @desc    Get stories for the user's feed
// @route   GET /api/stories/feed
// @access  Private
router.get('/feed', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const [stories] = await pool.query(`
            SELECT 
                s.id,
                JSON_OBJECT('id', u.id, 'username', u.username, 'avatar', u.avatar_url) as user,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('id', si.id, 'media', si.media_url, 'mediaType', si.media_type, 'duration', si.duration_ms)
                ) FROM story_items si WHERE si.story_id = s.id) as stories
            FROM stories s
            JOIN users u ON s.user_id = u.id
            WHERE (s.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) OR s.user_id = ?)
            AND s.created_at >= NOW() - INTERVAL 1 DAY
            GROUP BY s.id, u.id
            ORDER BY u.id = ? DESC, s.created_at DESC;
        `, [userId, userId, userId]);
        res.json({ stories: stories.map(s => ({...s, stories: s.stories || []})) });
    } catch (error) {
        console.error('Get Stories Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
router.post('/', protect, upload.single('media'), async (req, res) => {
    const userId = req.user.id;
    
    if (!req.file) {
        return res.status(400).json({ message: "Story media file is required." });
    }
    
    const mediaUrl = `/uploads/${req.file.filename}`;
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const duration = mediaType === 'image' ? 7000 : null; // Duration for images, null for videos

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existingStory] = await connection.query(
            'SELECT id FROM stories WHERE user_id = ? AND created_at >= CURDATE()',
            [userId]
        );
        
        let storyId;
        if (existingStory.length > 0) {
            storyId = existingStory[0].id;
        } else {
            const [storyResult] = await connection.query('INSERT INTO stories (user_id) VALUES (?)', [userId]);
            storyId = storyResult.insertId;
        }
        
        await connection.query(
            'INSERT INTO story_items (story_id, media_url, media_type, duration_ms) VALUES (?, ?, ?, ?)',
            [storyId, mediaUrl, mediaType, duration]
        );
        
        await connection.commit();
        
        res.status(201).json({ message: "Story created successfully" });

    } catch (error) {
        await connection.rollback();
        console.error('Create Story Error:', error);
        res.status(500).json({ message: 'Server error while creating story.' });
    } finally {
        connection.release();
    }
});

export default router;
