import { Router } from 'express';
import { MOCK_USERS } from './data.js';

const router = Router();

const sanitizeUser = (user) => {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
}

// Register a new user
router.post('/register', (req, res) => {
    const { email, name, username, password, phone, dob } = req.body;
    
    if (!email || !name || !username || !password || !phone || !dob) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const usernameExists = MOCK_USERS.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
        return res.status(409).json({ message: 'Username is already taken' });
    }
    
    const emailExists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        return res.status(409).json({ message: 'Email is already in use' });
    }

    const newUser = {
        id: `u${Date.now()}`,
        username,
        name,
        email,
        password, // In a real app, this should be hashed using bcrypt
        phone,
        dob,
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        isVerified: false,
        isPremium: false,
        isPrivate: false,
        bio: '',
        followers: [],
        following: [],
    };

    MOCK_USERS.push(newUser);
    res.status(201).json(sanitizeUser(newUser));
});

// Login a user
router.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    
    const user = MOCK_USERS.find(
        u => (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase())
    );

    if (user && user.password === password) {
        res.json(sanitizeUser(user));
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


// Get current user based on ID (simulating a session)
router.get('/me/:id', (req, res) => {
    const user = MOCK_USERS.find(u => u.id === req.params.id);
    if (user) {
        res.json(sanitizeUser(user));
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Mock logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

export default router;
