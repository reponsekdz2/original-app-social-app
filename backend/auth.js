

import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from './db.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const router = Router();
const saltRounds = 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password, name, phone, dob, gender, country } = req.body;

    if (!username || !email || !password || !name || !dob) {
        return res.status(400).json({ message: 'Username, email, password, name, and date of birth are required.' });
    }
    
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.'});
    }
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dob)) {
        return res.status(400).json({ message: 'Invalid date of birth format. Please use YYYY-MM-DD.'});
    }

    try {
        const queryParams = [username, email];
        let queryStr = 'SELECT * FROM users WHERE username = ? OR email = ?';
        if (phone) {
            queryStr += ' OR phone = ?';
            queryParams.push(phone);
        }

        const [existingUsers] = await pool.query(queryStr, queryParams);

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Username, email, or phone number already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query(
            'INSERT INTO users (username, name, email, password, phone, dob, gender, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, name, email, hashedPassword, phone || null, dob, gender || 'Prefer not to say', country || null]
        );
        
        const userId = result.insertId;

        req.session.userId = userId;
        req.session.username = username;

        const [users] = await pool.query('SELECT id, username, name, avatar_url, bio, website, is_verified, is_private, is_admin FROM users WHERE id = ?', [userId]);

        res.status(201).json({ user: users[0] });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username: identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Identifier and password are required.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?', [identifier, identifier, identifier]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        
        await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // We don't want to send the password hash back
        delete user.password;

        res.json({ user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        res.clearCookie('talka_session');
        res.status(200).json({ message: 'Logged out successfully.' });
    });
});

// GET /api/auth/session
router.get('/session', isAuthenticated, async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT 
                u.id, u.username, u.name, u.avatar_url, u.bio, u.website, 
                u.is_verified, u.is_private, u.is_admin, u.is_premium,
                (SELECT COUNT(*) FROM followers WHERE following_id = u.id) as follower_count,
                (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) as following_count
            FROM users u WHERE u.id = ?
        `, [req.session.userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found for this session.' });
        }

        const user = users[0];

        const [following] = await pool.query('SELECT following_id FROM followers WHERE follower_id = ?', [user.id]);
        user.following = following.map(f => ({ id: f.following_id })); // Simplified for now

        res.json({ user });
    } catch (error) {
        console.error('Session check error:', error);
        res.status(500).json({ message: 'Internal server error checking session.' });
    }
});


export default router;