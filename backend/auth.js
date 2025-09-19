import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { username, name, email, password, phone, dob } = req.body;
    
    if (!username || !email || !password || !name || !phone || !dob) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const [userExists] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);

        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (username, name, email, password_hash, phone, dob) VALUES (?, ?, ?, ?, ?, ?)',
            [username, name, email, hashedPassword, phone, dob]
        );
        const newUser_id = result.insertId;

        const [newUserRows] = await pool.query('SELECT id, username, name, email, avatar_url as avatar, is_premium, is_verified, is_private FROM users WHERE id = ?', [newUser_id]);

        if (newUserRows.length > 0) {
            const user = newUserRows[0];
            res.status(201).json({
                user,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // identifier can be username or email

    try {
        const [users] = await pool.query(
            'SELECT id, username, name, email, password_hash, avatar_url as avatar, is_premium, is_verified, is_private FROM users WHERE username = ? OR email = ?', 
            [identifier, identifier]
        );

        if (users.length > 0) {
            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                // Don't send the password hash back
                delete user.password_hash; 
                res.json({
                    user,
                    token: generateToken(user.id),
                });
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide old and new passwords.' });
    }

    try {
        const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json({ message: 'Password changed successfully.' });

    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error while changing password.' });
    }
});


export default router;
