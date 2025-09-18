import { Router } from 'express';
import db, { generateId, hydrate } from './data.js';

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

    const usernameExists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
        return res.status(409).json({ message: 'Username is already taken' });
    }
    
    const emailExists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        return res.status(409).json({ message: 'Email is already in use' });
    }

    const newUser = {
        id: generateId('user'),
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
        notificationSettings: { likes: true, comments: true, follows: true },
    };

    db.users.push(newUser);
    res.status(201).json(sanitizeUser(newUser));
});

// Login a user
router.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    
    const user = db.users.find(
        u => (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase())
    );

    if (user && user.password === password) {
        res.json(sanitizeUser(hydrate(user, ['followers', 'following'])));
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Forgot password
router.post('/forgot-password', (req, res) => {
    const { identifier } = req.body;
    const user = db.users.find(u => u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase());

    // In a real app, you'd generate a token, save it with an expiry, and email a link.
    // For this app, we'll always return success to prevent user enumeration.
    if (user) {
        console.log(`Password reset requested for ${user.username}. In a real app, an email would be sent.`);
    } else {
        console.log(`Password reset requested for non-existent user: ${identifier}.`);
    }
    res.status(200).json({ message: 'If your account exists, a password reset link has been sent.' });
});

// Reset password
router.post('/reset-password', (req, res) => {
    const { identifier, password } = req.body;
    
    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }
    
    const user = db.users.find(u => u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase());
    
    if (user) {
        user.password = password;
        console.log(`Password for ${user.username} has been reset.`);
        res.status(200).json({ message: 'Password has been successfully reset.' });
    } else {
        // Should technically not happen if the identifier is passed correctly from the previous step,
        // but good to have a safeguard.
        res.status(404).json({ message: 'User not found.' });
    }
});


// Get current user based on ID (simulating a session)
router.get('/me/:id', (req, res) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (user) {
        res.json(sanitizeUser(hydrate(user, ['followers', 'following', 'stories', 'highlights'])));
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Mock logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

export default router;