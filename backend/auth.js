import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';
import crypto from 'crypto';

const router = Router();
const SALT_ROUNDS = 10;
const ADMIN_EMAIL = 'reponsekdz0@gmail.com';
const ADMIN_PASSWORD = '2025';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { email, name, username, password, phone, dob } = req.body;
    if (!email || !name || !username || !password || !phone || !dob) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User with this email or username already exists.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const isAdmin = email === ADMIN_EMAIL;

        await pool.query(
            'INSERT INTO users (email, name, username, password, phone, dob, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, name, username, hashedPassword, phone, dob, isAdmin]
        );
        
        const [newUserRows] = await pool.query('SELECT id, username, name, email, avatar_url as avatar, is_premium, is_verified, is_admin FROM users WHERE username = ?', [username]);

        if (newUserRows.length > 0) {
            const user = newUserRows[0];
            // Create session
            req.session.user = { id: user.id, username: user.username, isAdmin: user.is_admin };
            res.status(201).json({ user });
        } else {
             throw new Error('Failed to retrieve new user after creation.');
        }

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please provide username/email and password.' });
    }

    try {
        // Special admin backdoor login
        if (identifier === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const [users] = await pool.query('SELECT *, avatar_url as avatar FROM users WHERE email = ?', [ADMIN_EMAIL]);
            if (users.length === 0) {
                 return res.status(401).json({ message: 'Admin account does not exist. Please register first.' });
            }
            const user = users[0];
            await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
            req.session.user = { id: user.id, username: user.username, isAdmin: true }; // Force admin status
            const { password, ...userWithoutPassword } = user;
            userWithoutPassword.isAdmin = true;
            return res.json({ user: userWithoutPassword });
        }

        const [users] = await pool.query(
            'SELECT *, avatar_url as avatar FROM users WHERE username = ? OR email = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
            // Create session
            req.session.user = { id: user.id, username: user.username, isAdmin: user.is_admin };
            const { password, ...userWithoutPassword } = user;
            res.json({ user: userWithoutPassword });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// @desc    Log user out
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        res.status(200).json({ message: 'Logged out successfully' });
    });
});


// @desc    Get current user's data
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                u.id, u.username, u.name, u.email, u.avatar_url as avatar, u.bio, u.website, u.gender, 
                u.is_premium, u.is_verified, u.is_private, u.is_admin, u.last_login, u.wallet_balance,
                COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', f.id, 'username', f.username, 'avatar', f.avatar_url)) FROM followers fo JOIN users f ON fo.following_id = f.id WHERE fo.follower_id = u.id), JSON_ARRAY()) as following,
                COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', f.id, 'username', f.username, 'avatar', f.avatar_url)) FROM followers fo JOIN users f ON fo.follower_id = f.id WHERE fo.following_id = u.id), JSON_ARRAY()) as followers,
                COALESCE(JSON_OBJECT("likes", us.likes_notifications, "comments", us.comments_notifications, "follows", us.follows_notifications), JSON_OBJECT("likes", TRUE, "comments", TRUE, "follows", TRUE)) as notificationSettings,
                COALESCE((SELECT JSON_ARRAYAGG(mu.muted_user_id) FROM muted_users mu WHERE mu.user_id = u.id), JSON_ARRAY()) as mutedUsers,
                COALESCE((SELECT JSON_ARRAYAGG(bu.blocked_user_id) FROM blocked_users bu WHERE bu.user_id = u.id), JSON_ARRAY()) as blockedUsers
             FROM users u
             LEFT JOIN user_settings us ON u.id = us.user_id
             WHERE u.id = ?`, [req.user.id]
        );
        if (rows.length > 0) {
            res.json({ user: rows[0] });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required.' });
    }

    try {
        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }
        
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json({ message: 'Password changed successfully.' });

    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error while changing password.' });
    }
});

// @desc    Forgot password - Step 1: Generate & send token
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            // Still send a success message to prevent user enumeration
            return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
        }
        const user = users[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token to expire in 1 hour
        const tokenExpiry = new Date(Date.now() + 3600000); 

        await pool.query(
            'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
            [hashedToken, tokenExpiry, user.id]
        );

        // Here you would email the `resetToken` to the user.
        // For this app, we'll return it for simulation purposes.
        console.log(`Password reset link for ${email}: /?resetToken=${resetToken}`);
        res.json({ message: "If an account with that email exists, a password reset link has been sent.", resetTokenForSimulation: resetToken });
    } catch(error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Reset password - Step 2: Verify token & update password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required." });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const [users] = await pool.query(
            'SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
            [hashedToken]
        );
        if (users.length === 0) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }
        const user = users[0];

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        await pool.query(
            'UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );
        
        res.json({ message: "Password has been reset successfully. You can now log in." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Enable 2FA (mock)
// @route   POST /api/auth/enable-2fa
// @access  Private
router.post('/enable-2fa', protect, async (req, res) => {
    const userId = req.user.id;
    try {
        await pool.query('UPDATE users SET is_2fa_enabled = TRUE WHERE id = ?', [userId]);
        res.json({ message: "Two-Factor Authentication has been enabled." });
    } catch(error) {
        console.error('Enable 2FA Error:', error);
        res.status(500).json({ message: 'Server error while enabling 2FA.' });
    }
});


export default router;