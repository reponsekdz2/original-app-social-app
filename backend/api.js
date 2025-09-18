// This file defines the main API routes for the application.
import { Router } from 'express';
import db, { hydrate, generateId } from './data.js';

const router = Router();

// --- Main Data Fetching Endpoint ---
router.get('/app-data/:userId', (req, res) => {
    const { userId } = req.params;
    const currentUser = db.users.find(u => u.id === userId);

    if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real app, this would be a more complex feed algorithm
    const feedPostIds = db.posts.map(p => p.id);
    const hydratedPosts = hydrate(db.posts.filter(p => feedPostIds.includes(p.id)), ['user', 'comments', 'likedBy']);

    const appData = {
        users: db.users.map(u => ({...u, password: ''})),
        posts: hydratedPosts,
        stories: hydrate(db.stories, ['user']),
        reels: hydrate(db.reels, ['user', 'comments', 'likedBy']),
        conversations: hydrate(db.conversations.filter(c => c.participantIds.includes(userId)), ['participants', 'messages']),
        suggestedUsers: hydrate(db.users.filter(u => u.id !== userId && !currentUser.following.includes(u.id)), ['followers']),
        trendingTopics: db.trendingTopics,
        feedActivities: hydrate(db.feedActivities, ['user', 'targetPost', 'targetUser']),
        sponsoredContent: db.sponsoredContent,
        notifications: hydrate(db.notifications, ['user', 'post']),
        testimonials: hydrate(db.testimonials, ['user']),
        helpArticles: db.helpArticles,
    };
    res.json(appData);
});


// --- User Actions ---
router.post('/users/follow', (req, res) => {
    const { currentUserId, targetUserId } = req.body;
    const currentUser = db.users.find(u => u.id === currentUserId);
    const targetUser = db.users.find(u => u.id === targetUserId);

    if (currentUser && targetUser) {
        if (!currentUser.following.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
        }
        if (!targetUser.followers.includes(currentUserId)) {
            targetUser.followers.push(currentUserId);
        }
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.post('/users/unfollow', (req, res) => {
    const { currentUserId, targetUserId } = req.body;
    const currentUser = db.users.find(u => u.id === currentUserId);
    const targetUser = db.users.find(u => u.id === targetUserId);
    if (currentUser && targetUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.put('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const updatedData = req.body;
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex > -1) {
        // In a real app, you'd validate the fields in updatedData
        db.users[userIndex] = { ...db.users[userIndex], ...updatedData };
        const { password, ...sanitizedUser } = db.users[userIndex];
        res.json(hydrate(sanitizedUser, ['followers', 'following']));
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


// --- Post Actions ---
router.post('/posts', (req, res) => {
    const { user, media, caption } = req.body;
    const newPost = {
        id: generateId('post'),
        userId: user.id,
        media,
        caption,
        likes: 0,
        likedBy: [],
        commentIds: [],
        timestamp: 'Just now',
        isArchived: false,
        commentsDisabled: false,
    };
    db.posts.unshift(newPost);
    res.status(201).json(hydrate(newPost, ['user']));
});

router.post('/posts/:id/toggle-like', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const post = db.posts.find(p => p.id === id);
    if (post) {
        const userIndex = post.likedBy.indexOf(userId);
        if (userIndex > -1) {
            post.likedBy.splice(userIndex, 1);
        } else {
            post.likedBy.push(userId);
        }
        post.likes = post.likedBy.length;
        res.json({ success: true, likes: post.likes, isLiked: userIndex === -1 });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

router.post('/posts/:id/toggle-save', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (user) {
        const postIndex = user.savedPostIds.indexOf(id);
        if (postIndex > -1) {
            user.savedPostIds.splice(postIndex, 1);
        } else {
            user.savedPostIds.push(id);
        }
        res.json({ success: true, isSaved: postIndex === -1 });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.post('/posts/:id/comment', (req, res) => {
    const { id } = req.params;
    const { userId, text, replyToId } = req.body;
    const post = db.posts.find(p => p.id === id);
    if (post) {
        const newComment = {
            id: generateId('comment'),
            userId,
            text,
            timestamp: 'Just now',
            likes: 0,
            likedBy: [],
            replyToId: replyToId || null,
            replyIds: [],
        };
        db.comments.push(newComment);

        if (replyToId) {
            const parentComment = db.comments.find(c => c.id === replyToId);
            if (parentComment) {
                parentComment.replyIds.push(newComment.id);
            }
        } else {
            post.commentIds.push(newComment.id);
        }
        res.status(201).json(hydrate(newComment, ['user']));
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});


// --- Comment Actions ---
router.post('/comments/:id/toggle-like', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const comment = db.comments.find(c => c.id === id);
    if (comment) {
        const userIndex = comment.likedBy.indexOf(userId);
        if (userIndex > -1) {
            comment.likedBy.splice(userIndex, 1);
        } else {
            comment.likedBy.push(userId);
        }
        comment.likes = comment.likedBy.length;
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
});

// --- Reel Actions ---
router.post('/reels/:id/comment', (req, res) => {
    const { id } = req.params;
    const { userId, text, replyToId } = req.body;
    const reel = db.reels.find(p => p.id === id);
    if (reel) {
        const newComment = {
            id: generateId('comment'),
            userId,
            text,
            timestamp: 'Just now',
            likes: 0,
            likedBy: [],
            replyToId: replyToId || null,
            replyIds: [],
        };
        db.comments.push(newComment);
        if (replyToId) {
            const parentComment = db.comments.find(c => c.id === replyToId);
            if(parentComment) parentComment.replyIds.push(newComment.id);
        } else {
             reel.commentIds.push(newComment.id);
        }
        res.status(201).json(hydrate(newComment, ['user']));
    } else {
        res.status(404).json({ message: 'Reel not found' });
    }
});

// --- Message Actions ---
router.post('/conversations/find-or-create', (req, res) => {
    const { userId1, userId2 } = req.body;
    let convo = db.conversations.find(c => 
        c.participantIds.includes(userId1) && c.participantIds.includes(userId2)
    );

    if (convo) {
        res.json(hydrate(convo, ['participants', 'messages']));
    } else {
        const newConvo = {
            id: generateId('convo'),
            participantIds: [userId1, userId2],
            messageIds: [],
        };
        db.conversations.unshift(newConvo);
        res.status(201).json(hydrate(newConvo, ['participants', 'messages']));
    }
});

router.post('/conversations/:convoId/messages', (req, res) => {
    const { convoId } = req.params;
    const { senderId, recipientId, content, type, replyToId, sharedPostId } = req.body;
    const convo = db.conversations.find(c => c.id === convoId);

    if (convo) {
        const newMessage = {
            id: generateId('msg'),
            conversationId: convoId,
            senderId,
            content,
            type,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyToId: replyToId || null,
            sharedPostId: sharedPostId || null,
        };
        db.messages.push(newMessage);
        convo.messageIds.push(newMessage.id);
        
        // --- Real-time part ---
        const io = req.app.get('io');
        const hydratedConvo = hydrate(convo, ['participants', 'messages']);
        
        // Emit to both sender and receiver to ensure sync
        io.to(senderId).emit('receive_message', { conversation: hydratedConvo });
        io.to(recipientId).emit('receive_message', { conversation: hydratedConvo });

        res.status(201).json(newMessage);
    } else {
        res.status(404).json({ message: 'Conversation not found' });
    }
});

router.delete('/conversations/:convoId/messages/:msgId', (req, res) => {
    const { convoId, msgId } = req.params;
    const convo = db.conversations.find(c => c.id === convoId);
    if (convo) {
        convo.messageIds = convo.messageIds.filter(id => id !== msgId);
        db.messages = db.messages.filter(m => m.id !== msgId);
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'Conversation not found' });
    }
});

// --- Misc Actions ---
router.post('/report', (req, res) => {
    const { contentId, contentType, reason, reportingUserId } = req.body;
    console.log(`Report received from ${reportingUserId}:`);
    console.log(`Content: ${contentType} - ${contentId}`);
    console.log(`Reason: ${reason}`);
    // In a real app, save this to a moderation queue
    res.json({ success: true, message: 'Report submitted successfully.' });
});

export default router;
