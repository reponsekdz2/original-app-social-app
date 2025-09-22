import { Router } from 'express';
import pool from './db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { protect } from './middleware/authMiddleware.js';

const router = Router();
const BCRYPT_SALT_ROUNDS = 12;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { email, name, username, password, phone, dob } = req.body;

    if (!email || !name || !username || !password || !phone || !dob) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    
    // Basic validation
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check if user already exists
        const [existingUsers] = await connection.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        // Insert the user
        await connection.query(
            'INSERT INTO users (username, name, email, password, phone, dob) VALUES (?, ?, ?, ?, ?, ?)',
            [username, name, email, hashedPassword, phone, dob]
        );
        
        // Fetch the newly created user to get their database-generated UUID
        const [[newUser]] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);

        if (!newUser) {
            throw new Error('Failed to retrieve newly created user.');
        }

        const userId = newUser.id;

        // Now use the correct UUID to insert settings
        await connection.query('INSERT INTO user_settings (user_id) VALUES (?)', [userId]);

        await connection.commit();

        req.session.user = { id: userId };

        const userToReturn = {
            id: userId,
            username,
            name,
            email,
            avatar: '/uploads/default_avatar.png',
        };

        res.status(201).json({ user: userToReturn });

    } catch (error) {
        await connection.rollback();
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    } finally {
        connection.release();
    }
});


// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please provide username/email and password' });
    }

    try {
        // Special admin login
        if (identifier === 'reponsekdz0@gmail.com' && password === '2025') {
            const [[adminUser]] = await pool.query(
                `SELECT * FROM users WHERE email = ? AND is_admin = TRUE`, 
                [identifier]
            );

            if (adminUser) {
                req.session.user = { id: adminUser.id };
                await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [adminUser.id]);
                
                // Simplified user object return
                const userToReturn = {
                    ...adminUser,
                    avatar: adminUser.avatar_url,
                    notificationSettings: {},
                    followers: [],
                    following: [],
                    mutedUsers: [],
                    blockedUsers: []
                };
                return res.json({ user: userToReturn });
            }
        }

        // Regular user login
        const [[user]] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier]);

        if (user && await bcrypt.compare(password, user.password)) {
             // Check if user is suspended or banned
            if (user.status === 'banned' || user.status === 'suspended') {
                return res.status(403).json({ message: `Your account has been ${user.status}. Please contact support.` });
            }
            
            req.session.user = { id: user.id };

            await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
            
            // Let frontend fetch full user details with getMe
            const userToReturn = {
                ...user,
                avatar: user.avatar_url,
                notificationSettings: {},
                followers: [],
                following: [],
                mutedUsers: [],
                blockedUsers: []
            };

            res.json({ user: userToReturn });

        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        res.clearCookie('connect.sid'); // The default cookie name for express-session
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const [[fullUser]] = await pool.query(
            `SELECT 
                u.id, u.username, u.name, u.email, u.avatar_url as avatar, u.bio, u.website, u.gender, u.is_premium, u.is_verified, 
                u.is_private, u.is_admin, u.status, u.wallet_balance,
                us.likes_notifications, us.comments_notifications, us.follows_notifications,
                (SELECT JSON_ARRAYAGG(f.following_id) FROM followers f WHERE f.follower_id = u.id) as following_ids,
                (SELECT JSON_ARRAYAGG(f.follower_id) FROM followers f WHERE f.following_id = u.id) as follower_ids,
                (SELECT JSON_ARRAYAGG(mu.muted_user_id) FROM muted_users mu WHERE mu.user_id = u.id) as muted_users_ids,
                (SELECT JSON_ARRAYAGG(bu.blocked_user_id) FROM blocked_users bu WHERE bu.user_id = u.id) as blocked_users_ids,
                 COALESCE((SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('id', sh.id, 'title', sh.title, 'cover', sh.cover_image_url)
                 ) FROM story_highlights sh WHERE sh.user_id = u.id), JSON_ARRAY()) as highlights
             FROM users u
             LEFT JOIN user_settings us ON u.id = us.user_id
             WHERE u.id = ?`,
            [userId]
        );

        if (!fullUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch full user objects for followers/following
        const followerIds = JSON.parse(fullUser.follower_ids || '[]');
        const followingIds = JSON.parse(fullUser.following_ids || '[]');
        
        let followers = [], following = [];
        if (followerIds.length > 0) {
            const [f_users] = await pool.query('SELECT id, username, name, avatar_url as avatar, is_verified FROM users WHERE id IN (?)', [followerIds]);
            followers = f_users;
        }
        if (followingIds.length > 0) {
             const [f_users] = await pool.query('SELECT id, username, name, avatar_url as avatar, is_verified FROM users WHERE id IN (?)', [followingIds]);
            following = f_users;
        }


        const userToReturn = {
            ...fullUser,
            followers,
            following,
            mutedUsers: JSON.parse(fullUser.muted_users_ids || '[]'),
            blockedUsers: JSON.parse(fullUser.blocked_users_ids || '[]'),
            highlights: fullUser.highlights,
            notificationSettings: {
                likes: !!fullUser.likes_notifications,
                comments: !!fullUser.comments_notifications,
                follows: !!fullUser.follows_notifications,
            },
        };

        res.json({ user: userToReturn });

    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const [[user]] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ message: 'Incorrect old password.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Forgot password - generate token
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const [[user]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (!user) {
            // Silently succeed to prevent email enumeration attacks
            return res.json({ message: 'If a user with that email exists, a reset link has been sent.' });
        }
        
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await pool.query(
            'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
            [token, expires, user.id]
        );

        // In a real app, you would email this link: `${CLIENT_URL}/reset-password?resetToken=${token}`
        console.log(`Password reset token for ${email}: ${token}`);
        
        res.json({ 
            message: 'If a user with that email exists, a reset link has been sent.',
            resetTokenForSimulation: token // For simulation purposes
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const [[user]] = await pool.query(
            'SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
            [token]
        );
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        await pool.query(
            'UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



export default router;