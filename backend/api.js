import { Router } from 'express';
import {
  MOCK_POSTS,
  MOCK_USERS,
  MOCK_STORIES,
  MOCK_REELS,
  MOCK_CONVERSATIONS,
  MOCK_ACTIVITIES,
  MOCK_SUPPORT_TICKETS,
  MOCK_TRENDING_TOPICS,
  MOCK_FEED_ACTIVITIES,
  MOCK_ADS,
} from './data.js';

const router = Router();

// Middleware to find a user by ID
const findUser = (id) => MOCK_USERS.find(u => u.id === id);

// --- AUTH ---
router.get('/currentUser', (req, res) => {
    // In a real app, this would come from a session/token
    res.json(MOCK_USERS[0]);
});

// --- POSTS ---
router.get('/posts', (req, res) => {
  res.json(MOCK_POSTS);
});

router.post('/posts', (req, res) => {
    const { user, media, caption } = req.body;
    const currentUser = findUser(user.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const newPost = {
        user: currentUser,
        media,
        caption,
        id: `p${Date.now()}`,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: '1m',
        isSaved: false,
        isLiked: false,
    };
    MOCK_POSTS.unshift(newPost);
    res.status(201).json(newPost);
});

router.post('/posts/:id/toggle-like', (req, res) => {
    const { userId } = req.body;
    const post = MOCK_POSTS.find(p => p.id === req.params.id);
    if (post) {
        post.isLiked = !post.isLiked;
        post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/posts/:id/toggle-save', (req, res) => {
    const post = MOCK_POSTS.find(p => p.id === req.params.id);
    if (post) {
        post.isSaved = !post.isSaved;
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/posts/:id/comment', (req, res) => {
    const { userId, text } = req.body;
    const post = MOCK_POSTS.find(p => p.id === req.params.id);
    const user = findUser(userId);
    if (post && user) {
        const newComment = {
            id: `c${Date.now()}`,
            user,
            text,
            timestamp: '1m',
            likes: 0,
            likedByUser: false,
        };
        post.comments.push(newComment);
        res.json(post);
    } else {
        res.status(404).send('Post or user not found');
    }
});

router.delete('/posts/:id', (req, res) => {
    const index = MOCK_POSTS.findIndex(p => p.id === req.params.id);
    if (index > -1) {
        MOCK_POSTS.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Post not found');
    }
});

router.put('/posts/:id', (req, res) => {
    const { caption } = req.body;
    const post = MOCK_POSTS.find(p => p.id === req.params.id);
    if (post) {
        post.caption = caption;
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/posts/:id/archive', (req, res) => {
    const post = MOCK_POSTS.find(p => p.id === req.params.id);
    if (post) {
        post.isArchived = !post.isArchived;
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

// --- USERS ---
router.get('/users', (req, res) => {
    res.json(MOCK_USERS);
});

router.post('/users/follow', (req, res) => {
    const { currentUserId, targetUserId } = req.body;
    const currentUser = findUser(currentUserId);
    const targetUser = findUser(targetUserId);

    if (currentUser && targetUser) {
        // Add to following/followers
        if (!currentUser.following.some(u => u.id === targetUserId)) {
            currentUser.following.push(targetUser);
        }
        if (!targetUser.followers.some(u => u.id === currentUserId)) {
            targetUser.followers.push(currentUser);
        }
        res.json({ currentUser, targetUser });
    } else {
        res.status(404).send('User not found');
    }
});

router.post('/users/unfollow', (req, res) => {
    const { currentUserId, targetUserId } = req.body;
    const currentUser = findUser(currentUserId);
    const targetUser = findUser(targetUserId);

    if (currentUser && targetUser) {
        currentUser.following = currentUser.following.filter(u => u.id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(u => u.id !== currentUserId);
        res.json({ currentUser, targetUser });
    } else {
        res.status(404).send('User not found');
    }
});

router.put('/users/:id', (req, res) => {
    const updatedUserData = req.body;
    const userIndex = MOCK_USERS.findIndex(u => u.id === req.params.id);
    if (userIndex > -1) {
        MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updatedUserData };
        res.json(MOCK_USERS[userIndex]);
    } else {
        res.status(404).send('User not found');
    }
});


// --- MESSAGES ---
router.get('/conversations', (req, res) => {
    res.json(MOCK_CONVERSATIONS);
});

router.get('/conversations/:id', (req, res) => {
    const convo = MOCK_CONVERSATIONS.find(c => c.id === req.params.id);
    if (convo) {
        res.json(convo);
    } else {
        res.status(404).send('Conversation not found');
    }
});


router.post('/conversations/:id/messages', (req, res) => {
    const { senderId, content, type, replyTo, duration } = req.body;
    const convo = MOCK_CONVERSATIONS.find(c => c.id === req.params.id);

    if (convo) {
        const newMessage = {
            id: `m${Date.now()}`,
            senderId,
            content,
            type,
            replyTo,
            duration,
            timestamp: 'Just now',
        };
        convo.messages.push(newMessage);
        res.json(convo);
    } else {
        res.status(404).send('Conversation not found');
    }
});

// --- CALLS (Mock) ---
router.post('/calls/initiate', (req, res) => {
    const { callerId, receiverId, type } = req.body;
    const receiver = findUser(receiverId);
    if (receiver) {
        console.log(`${callerId} is ${type} calling ${receiverId}`);
        res.json({ message: `Successfully initiated ${type} call with ${receiver.username}` });
    } else {
        res.status(404).send('Receiver not found');
    }
});

// --- OTHER DATA ---
router.get('/stories', (req, res) => res.json(MOCK_STORIES));
router.get('/reels', (req, res) => res.json(MOCK_REELS));
router.get('/activities', (req, res) => res.json(MOCK_ACTIVITIES));
router.get('/support-tickets', (req, res) => res.json(MOCK_SUPPORT_TICKETS));
router.get('/trending-topics', (req, res) => res.json(MOCK_TRENDING_TOPICS));
router.get('/feed-activities', (req, res) => res.json(MOCK_FEED_ACTIVITIES));
router.get('/ads', (req, res) => res.json(MOCK_ADS));

export default router;