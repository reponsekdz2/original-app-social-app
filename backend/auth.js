import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import { protect } from './middleware/authMiddleware.js';

const router = Router();
const SALT_ROUNDS = 10;

// Function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- Helper Functions ---
const findUserByUsernameOrEmail = async (identifier) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [identifier, identifier]
    );
    return rows[0];
};

const buildUserResponse = (user) => {
    if (!user) return null;
    const { password_hash, ...userResponse } = user;
    return userResponse;
};


// --- ROUTES ---

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { email, name, username, password, phone, dob } = req.body;

    if (!email || !name || !username || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const userExists = await findUserByUsernameOrEmail(username) || await findUserByUsernameOrEmail(email);
        if (userExists) {
            return res.status(409).json({ message: 'User with this email or username already exists' });
        }

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (username, name, email, password_hash, phone, dob) VALUES (?, ?, ?, ?, ?, ?)',
            [username, name, email, password_hash, phone, dob]
        );

        const newUser = {
            id: result.insertId,
            username,
            name,
            email,
        };

        res.status(201).json({
            ...buildUserResponse(newUser),
            token: generateToken(newUser.id),
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await findUserByUsernameOrEmail(identifier);

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                ...buildUserResponse(user),
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    // The user object is attached to req by the 'protect' middleware
    // Fetch full, fresh data from DB
    try {
        const [rows] = await pool.query('SELECT id, username, name, email, avatar_url as avatar, bio, website, is_verified, is_premium, is_private FROM users WHERE id = ?', [req.user.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch(error) {
        console.error("Failed to fetch user profile", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
