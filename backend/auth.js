import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();
const SALT_ROUNDS = 10;

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { email, name, username, password, phone, dob } = req.body;
    if (!email || !name || !username || !password || !phone || !dob) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User with this email or username already exists.' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (email, name, username, password, phone, dob) VALUES (?, ?, ?, ?, ?, ?)',
            [email, name, username, hashedPassword, phone, dob]
        );
        const userId = result.insertId;

        // Fetch the newly created user to return
        const [newUserRows] = await pool.query('SELECT id, username, name, email, avatar_url as avatar, is_premium, is_verified FROM users WHERE id = ?', [userId]);

        if (newUserRows.length > 0) {
            const user = newUserRows[0];
            const token = generateToken(user.id);
            res.status(201).json({ user, token });
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
    const { identifier, password } = req.body; // identifier can be username or email
    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please provide username/email and password.' });
    }

    try {
        const [users] = await pool.query(
            'SELECT id, username, name, email, password, avatar_url as avatar, is_premium, is_verified FROM users WHERE username = ? OR email = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = generateToken(user.id);
            // Omit password from the returned user object
            const { password, ...userWithoutPassword } = user;
            res.json({ user: userWithoutPassword, token });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
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

// @desc    Forgot password (mock)
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', (req, res) => {
    // In a real app, this would trigger an email with a reset link.
    // For now, we just simulate a successful response.
    res.json({ message: "If an account with that email exists, a password reset link has been sent." });
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