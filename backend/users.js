import { Router } from 'express';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// --- Helper Functions ---
const getUserProfile = async (username) => {
    const [userRows] = await pool.query(`
        SELECT id, username, name, avatar_url as avatar, bio, website, is_verified, is_premium, is_private
        FROM users WHERE username = ?`, [username]);

    if (userRows.length === 0) return null;
    const user = userRows[0];
    
    const [stats] = await pool.query(`
        SELECT 
            (SELECT COUNT(*) FROM posts WHERE user_id = ?) as post_count,
            (SELECT COUNT(*) FROM followers WHERE following_id = ?) as follower_count,
            (SELECT COUNT(*) FROM followers WHERE follower_id = ?) as following_count
    `, [user.id, user.id, user.id]);

    user.posts = stats[0].post_count;
    user.followers = stats[0].follower_count;
    user.following = stats[0].following_count;
    
    return user;
};

// --- Routes ---

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
router.get('/:username', async (req, res) => {
    try {
        const user = await getUserProfile(req.params.username);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const [posts] = await pool.query(`
            SELECT p.id, (SELECT pm.media_url FROM post_media pm WHERE pm.post_id = p.id ORDER BY pm.position LIMIT 1) as media_url
            FROM posts p WHERE p.user_id = ? AND p.is_archived = FALSE
            ORDER BY p.created_at DESC`, [user.id]);
        
        // In a real app, you'd fetch reels too
        const reels = [];
        
        res.json({ user, posts, reels });
    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Toggle follow a user
// @route   POST /api/users/:id/toggle-follow
// @access  Private
router.post('/:id/toggle-follow', protect, async (req, res) => {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId == targetUserId) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        const [existingFollow] = await pool.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, targetUserId]);
        
        if (existingFollow.length > 0) {
            await pool.query('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, targetUserId]);
        } else {
            await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [currentUserId, targetUserId]);
            // You would also create a notification here
        }
        
        res.json({ message: 'Follow status updated' });
    } catch (error) {
        console.error('Toggle Follow Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
    const { name, username, bio, website, gender } = req.body;
    const userId = req.user.id;

    let avatarUrl = req.user.avatar;
    if (req.file) {
        avatarUrl = `/uploads/${req.file.filename}`;
    }

    try {
        await pool.query(`
            UPDATE users 
            SET name = ?, username = ?, bio = ?, website = ?, gender = ?, avatar_url = ?
            WHERE id = ?`, 
            [name, username, bio, website, gender, avatarUrl, userId]
        );

        const [updatedUserRows] = await pool.query('SELECT id, username, name, avatar_url as avatar, bio, website FROM users WHERE id = ?', [userId]);
        
        res.json(updatedUserRows[0]);
    } catch (error) {
        console.error('Update Profile Error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username is already taken.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
