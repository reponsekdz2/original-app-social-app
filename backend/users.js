
import { Router } from 'express';
import db, { hydrate } from './data.js';

const router = Router();

const findUser = (id, res) => {
    const user = db.users.find(u => u.id === id);
    if (!user) {
        if(res) res.status(404).json({ message: 'User not found' });
        return null;
    }
    return user;
};

const fullHydrateUser = (user) => {
    if (!user) return null;
    return hydrate(user, ['followers', 'following', 'stories', 'highlights']);
};

// Get all users
router.get('/', (req, res) => {
    res.json(db.users.map(u => fullHydrateUser(u)));
});

// Get a specific user by username
router.get('/:username', (req, res) => {
    const user = db.users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const posts = db.posts.filter(p => p.user === user.id).map(p => hydrate(p, ['user']));
    const reels = db.reels.filter(r => r.user === user.id).map(r => hydrate(r, ['user']));
    
    res.json({
        user: fullHydrateUser(user),
        posts,
        reels
    });
});

// Toggle Follow on a User
router.post('/:id/toggle-follow', (req, res) => {
    const { currentUserId } = req.body;
    if (!currentUserId) return res.status(400).json({ message: "Current user ID is required" });

    const currentUser = findUser(currentUserId, res);
    const targetUser = findUser(req.params.id, res);

    if (!currentUser || !targetUser) return;

    const isFollowing = currentUser.following.includes(targetUser.id);

    if (isFollowing) {
        currentUser.following = currentUser.following.filter(id => id !== targetUser.id);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUser.id);
    } else {
        currentUser.following.push(targetUser.id);
        targetUser.followers.push(currentUser.id);
    }
    
    const updatedCurrentUser = fullHydrateUser(currentUser);
    const updatedTargetUser = fullHydrateUser(targetUser);

    const io = req.app.get('io');
    io.emit('user_updated', updatedCurrentUser);
    io.emit('user_updated', updatedTargetUser);

    res.json({ currentUser: updatedCurrentUser, targetUser: updatedTargetUser });
});

// Update User Profile
router.put('/:id', (req, res) => {
    const user = findUser(req.params.id, res);
    if (!user) return;
    
    const { name, username, bio, website, gender, avatar } = req.body;
    user.name = name ?? user.name;
    user.username = username ?? user.username;
    user.bio = bio ?? user.bio;
    user.website = website ?? user.website;
    user.gender = gender ?? user.gender;
    user.avatar = avatar ?? user.avatar;
    
    const finalUser = fullHydrateUser(user);
    req.app.get('io').emit('user_updated', finalUser);
    res.json(finalUser);
});

// Update User Settings
router.put('/:id/settings', (req, res) => {
    const user = findUser(req.params.id, res);
    if (!user) return;
    
    const { notificationSettings, isPrivate } = req.body;
    if (notificationSettings) {
        user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };
    }
    if (typeof isPrivate === 'boolean') {
        user.isPrivate = isPrivate;
    }
    
    const finalUser = fullHydrateUser(user);
    req.app.get('io').emit('user_updated', finalUser);
    res.json(finalUser);
});


// Create a Highlight
router.post('/:id/highlights', (req, res) => {
    const user = findUser(req.params.id, res);
    if (!user) return;

    const { title, storyIds } = req.body;
    if (!title || !storyIds || !Array.isArray(storyIds)) {
        return res.status(400).json({ message: 'Title and storyIds array are required.' });
    }
    
    const allUserStories = db.stories.find(s => s.user === user.id)?.stories || [];
    const storiesForHighlight = allUserStories.filter(s => storyIds.includes(s.id));

    if (storiesForHighlight.length === 0) {
        return res.status(400).json({ message: 'Cannot create an empty highlight.' });
    }
    
    const newHighlight = {
        id: generateId('highlight'),
        title,
        cover: storiesForHighlight[0].media,
        stories: storiesForHighlight,
    };

    if (!user.highlights) {
        user.highlights = [];
    }
    user.highlights.push(newHighlight);
    
    const finalUser = fullHydrateUser(user);
    req.app.get('io').emit('user_updated', finalUser);
    res.status(201).json(finalUser);
});


export default router;
