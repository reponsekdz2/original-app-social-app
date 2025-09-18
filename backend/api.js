
import { Router } from 'express';
import db, { findUser, findPost, findComment, createNotification, generateId, randomTimeAgo, hydrate, generateFeedActivities, findMessage, findReel, findStoryItem, findOrCreateConversation } from './data.js';

const router = Router();

// --- POSTS ---
router.get('/posts', (req, res) => {
  const posts = db.posts.map(p => hydrate(p, ['user', 'likedBy', 'comments']));
  res.json(posts);
});

router.get('/posts/explore', (req, res) => {
    const shuffled = [...db.posts, ...db.posts, ...db.posts].sort(() => 0.5 - Math.random());
    res.json(shuffled.map(p => hydrate(p, ['user', 'likedBy', 'comments'])));
});

router.post('/posts', (req, res) => {
    const { user, media, caption } = req.body;
    const currentUser = findUser(user.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const newPost = {
        userId: currentUser.id,
        media,
        caption,
        id: generateId('post'),
        likes: 0,
        likedBy: [],
        commentIds: [],
        timestamp: '1m',
        isSaved: false,
        isLiked: false, 
        commentsDisabled: false,
    };
    db.posts.unshift(newPost);
    res.status(201).json(hydrate(newPost, ['user', 'likedBy', 'comments']));
});

router.post('/posts/:id/toggle-like', (req, res) => {
    const { userId } = req.body;
    const post = findPost(req.params.id);
    const user = findUser(userId);
    if (!post || !user) return res.status(404).json({ message: "Post or user not found" });

    const likeIndex = post.likedBy.indexOf(userId);
    let isLiked = false;
    if (likeIndex > -1) {
        post.likedBy.splice(likeIndex, 1);
    } else {
        post.likedBy.push(userId);
        isLiked = true;
        if (post.userId !== userId) {
            createNotification({ recipientId: post.userId, type: 'like', user, post });
        }
    }
    post.likes = post.likedBy.length;
    res.json({ ...hydrate(post, ['user', 'likedBy', 'comments']), isLiked });
});

router.post('/posts/:id/toggle-save', (req, res) => {
    // In a real DB, this would be a separate table linking users and saved posts.
    // Here we just toggle a boolean on the post itself for simplicity.
    const post = findPost(req.params.id);
    if (post) {
        post.isSaved = !post.isSaved;
        res.json(hydrate(post, ['user', 'likedBy', 'comments']));
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/posts/:id/comment', (req, res) => {
    const { userId, text } = req.body;
    const post = findPost(req.params.id);
    const user = findUser(userId);
    if (!post || !user) return res.status(404).send('Post or user not found');

    const newComment = {
        id: generateId('comment'),
        userId,
        text,
        timestamp: randomTimeAgo(),
        likes: 0,
        likedBy: [],
    };
    db.comments.push(newComment);
    post.commentIds.push(newComment.id);
    if (post.userId !== userId) {
        createNotification({ recipientId: post.userId, type: 'comment', user, post, commentText: text });
    }
    res.json(hydrate(post, ['user', 'likedBy', 'comments']));
});

router.delete('/posts/:id', (req, res) => {
    db.posts = db.posts.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

router.put('/posts/:id', (req, res) => {
    const { caption } = req.body;
    const post = findPost(req.params.id);
    if (post) {
        post.caption = caption;
        res.json(hydrate(post, ['user', 'likedBy', 'comments']));
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/posts/:id/archive', (req, res) => {
    const post = findPost(req.params.id);
    if (post) {
        post.isArchived = !post.isArchived;
        res.json(hydrate(post, ['user', 'likedBy', 'comments']));
    } else {
        res.status(404).send('Post not found');
    }
});

router.put('/posts/:id/settings', (req, res) => {
    const { commentsDisabled } = req.body;
    const post = findPost(req.params.id);
    if (post) {
        post.commentsDisabled = !!commentsDisabled;
        res.json(hydrate(post, ['user', 'likedBy', 'comments']));
    } else {
        res.status(404).send('Post not found');
    }
});


// --- COMMENTS ---
router.post('/comments/:id/toggle-like', (req, res) => {
    const { userId } = req.body;
    const comment = findComment(req.params.id);
    const user = findUser(userId);
    if (!comment || !user) return res.status(404).json({ message: "Comment or user not found" });

    const likeIndex = comment.likedBy.indexOf(userId);
    if (likeIndex > -1) {
        comment.likedBy.splice(likeIndex, 1);
    } else {
        comment.likedBy.push(userId);
    }
    comment.likes = comment.likedBy.length;
    res.json(hydrate(comment, ['user']));
});


// --- USERS ---
router.get('/users', (req, res) => {
    res.json(db.users.map(u => hydrate(u, ['followers', 'following', 'userStories', 'highlights'])));
});

router.get('/users/suggestions/:userId', (req, res) => {
    const { userId } = req.params;
    const currentUser = findUser(userId);
    if (!currentUser) return res.status(404).send('User not found');

    const suggestions = db.users.filter(u => u.id !== userId && !currentUser.following.includes(u.id));
    res.json(suggestions.map(u => hydrate(u, ['followers', 'following'])));
});

router.post('/users/follow', (req, res) => {
    const { currentUserId, targetUserId } = req.body;
    const currentUser = findUser(currentUserId);
    const targetUser = findUser(targetUserId);

    if (!currentUser || !targetUser) return res.status(404).send('User not found');

    if (!currentUser.following.includes(targetUserId)) {
        currentUser.following.push(targetUserId);
    }
    if (!targetUser.followers.includes(currentUserId)) {
        targetUser.followers.push(currentUserId);
        createNotification({ recipientId: targetUserId, type: 'follow', user: currentUser });
    }
    res.json({ 
        currentUser: hydrate(currentUser, ['followers', 'following']), 
        targetUser: hydrate(targetUser, ['followers', 'following']) 
    });
});

router.post('/users/unfollow', (req, res) => {
    const { currentUserId, targetUserId } = req.body;
    const currentUser = findUser(currentUserId);
    const targetUser = findUser(targetUserId);

    if (!currentUser || !targetUser) return res.status(404).send('User not found');

    currentUser.following = currentUser.following.filter(id => id !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    res.json({ 
        currentUser: hydrate(currentUser, ['followers', 'following']), 
        targetUser: hydrate(targetUser, ['followers', 'following']) 
    });
});

router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUserData = req.body;
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex > -1) {
        // Prevent password from being overwritten
        delete updatedUserData.password;
        db.users[userIndex] = { ...db.users[userIndex], ...updatedUserData };
        res.json(hydrate(db.users[userIndex], ['followers', 'following']));
    } else {
        res.status(404).send('User not found');
    }
});

router.put('/users/:id/settings', (req, res) => {
    const { id } = req.params;
    const { isPrivate, notificationSettings } = req.body;
    const user = findUser(id);
    if (!user) return res.status(404).send('User not found');

    if (isPrivate !== undefined) user.isPrivate = isPrivate;
    if (notificationSettings) user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };

    res.json(hydrate(user, ['followers', 'following']));
});

router.put('/users/:id/password', (req, res) => {
    const { id } = req.params;
    const { current, new: newPassword } = req.body;
    const user = findUser(id);
    if (!user) return res.status(404).send('User not found');
    if (user.password !== current) return res.status(403).json({ message: 'Incorrect current password.' });
    
    user.password = newPassword;
    console.log(`Password for ${user.username} changed successfully.`);
    res.status(200).json({ message: 'Password updated successfully' });
});

router.post('/users/:id/premium', (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.isPremium = true;
    res.json(hydrate(user, ['followers', 'following']));
});


// Fix: Add a new endpoint to handle user relationships (mute, block, etc.).
router.post('/users/relationship', (req, res) => {
    const { currentUserId, targetUserId, action } = req.body;
    const currentUser = findUser(currentUserId);
    if (!currentUser) return res.status(404).send('Current user not found');
    
    let list;
    switch(action) {
        case 'mute':
        case 'unmute':
            list = currentUser.mutedUsers;
            break;
        case 'block':
        case 'unblock':
            list = currentUser.blockedUsers;
            break;
        case 'restrict':
        case 'unrestrict':
            list = currentUser.restrictedUsers;
            break;
        default:
            return res.status(400).send('Invalid action');
    }

    const isAdding = !action.startsWith('un');
    const userIndex = list.indexOf(targetUserId);

    if (isAdding && userIndex === -1) {
        list.push(targetUserId);
    } else if (!isAdding && userIndex > -1) {
        list.splice(userIndex, 1);
    }

    res.json(hydrate(currentUser, ['followers', 'following']));
});


// --- MESSAGES & CALLS ---
router.get('/conversations', (req, res) => {
    res.json(db.conversations.map(c => hydrate(c, ['participants', 'messages'])));
});

router.get('/conversations/:id', (req, res) => {
    const convo = db.conversations.find(c => c.id === req.params.id);
    if (convo) {
        res.json(hydrate(convo, ['participants', 'messages']));
    } else {
        res.status(404).send('Conversation not found');
    }
});

router.post('/messages/direct', (req, res) => {
    const { senderId, recipientId, content, type, replyToId, sharedPostId, duration } = req.body;

    const sender = findUser(senderId);
    const recipient = findUser(recipientId);
    if (!sender || !recipient) return res.status(404).send('User not found');

    const convo = findOrCreateConversation(senderId, recipientId);

    const newMessage = {
        id: generateId('message'),
        senderId,
        content,
        type,
        replyToId,
        sharedPostId,
        duration,
        timestamp: 'Just now',
    };
    db.messages.push(newMessage);
    convo.messages.push(newMessage.id);

    res.status(201).json(hydrate(convo, ['participants', 'messages']));
});

router.delete('/conversations/:convoId/messages/:msgId', (req, res) => {
    const { convoId, msgId } = req.params;
    const convo = db.conversations.find(c => c.id === convoId);
    if (!convo) return res.status(404).send('Conversation not found');

    const msgIndexInConvo = convo.messages.indexOf(msgId);
    if (msgIndexInConvo > -1) {
        convo.messages.splice(msgIndexInConvo, 1);
    }

    db.messages = db.messages.filter(m => m.id !== msgId);
    
    res.status(204).send();
});


router.post('/calls/initiate', (req, res) => {
    const { callerId, receiverId, type } = req.body;
    const caller = findUser(callerId);
    const receiver = findUser(receiverId);
    if (!caller || !receiver) return res.status(404).send('User not found');

    const convo = db.conversations.find(c => c.participants.includes(callerId) && c.participants.includes(receiverId));
    if (convo) {
        const callMessage = {
            id: generateId('message'),
            senderId: callerId,
            content: `${type === 'video' ? 'Video' : 'Audio'} call started`,
            type: 'system', // A new message type
            timestamp: 'Just now',
        };
        db.messages.push(callMessage);
        convo.messages.push(callMessage.id);
    }
    console.log(`${callerId} is ${type} calling ${receiverId}`);
    res.json({ message: `Successfully initiated ${type} call with ${receiver.username}` });
});


// --- NOTIFICATIONS ---
router.get('/notifications/:userId', (req, res) => {
    const { userId } = req.params;
    const userNotifications = db.notifications
        .filter(n => n.recipientId === userId)
        .map(n => hydrate(n, ['user', 'post']));
    res.json(userNotifications);
});

router.post('/notifications/:userId/mark-read', (req, res) => {
    const { userId } = req.params;
    db.notifications.forEach(n => {
        if (n.recipientId === userId) {
            n.read = true;
        }
    });
    res.json({ message: 'Notifications marked as read' });
});

// --- REELS ---
router.post('/reels/:id/toggle-like', (req, res) => {
    const { userId } = req.body;
    const reel = findReel(req.params.id);
    const user = findUser(userId);
    if (!reel || !user) return res.status(404).json({ message: "Reel or user not found" });

    const likeIndex = reel.likedBy.indexOf(userId);
    if (likeIndex > -1) {
        reel.likedBy.splice(likeIndex, 1);
    } else {
        reel.likedBy.push(userId);
    }
    reel.likes = reel.likedBy.length;
    res.json(hydrate(reel, ['user', 'comments', 'likedBy']));
});

router.post('/reels/:id/comment', (req, res) => {
    const { userId, text } = req.body;
    const reel = findReel(req.params.id);
    if (!reel) return res.status(404).send('Reel not found');

    const newComment = {
        id: generateId('comment'),
        userId,
        text,
        timestamp: randomTimeAgo(),
        likes: 0,
        likedBy: [],
    };
    db.comments.push(newComment);
    reel.commentIds.push(newComment.id);
    res.json(hydrate(reel, ['user', 'comments', 'likedBy']));
});


// --- STORIES & HIGHLIGHTS ---
router.post('/stories', (req, res) => {
    const { userId, storyItem } = req.body;
    const userStory = db.stories.find(s => s.userId === userId);
    if (!userStory) return res.status(404).send('User story container not found');
    
    const newStoryItem = { ...storyItem, id: generateId('storyItem') };
    userStory.stories.push(newStoryItem);
    res.json(db.stories.map(s => hydrate(s, ['user'])));
});

router.post('/highlights', (req, res) => {
    const { userId, title, storyIds } = req.body;
    const coverStory = findStoryItem(storyIds[0]);
    if (!coverStory) return res.status(400).send('Cover story not found');

    const newHighlight = {
        id: generateId('highlight'),
        userId,
        title,
        cover: coverStory.media,
        storyIds,
    };
    db.highlights.push(newHighlight);
    res.json(hydrate(findUser(userId), ['followers', 'following', 'userStories', 'highlights']));
});


// --- SUPPORT & VERIFICATION ---
router.post('/support-tickets', (req, res) => {
    const { subject, description } = req.body;
    const newTicket = {
        id: generateId('ticket'),
        subject,
        status: 'Open',
        lastUpdated: '1m ago',
        messages: [{ sender: 'user', text: description, timestamp: '1m ago' }],
    };
    db.supportTickets.unshift(newTicket);
    res.status(201).json(newTicket);
});

router.post('/verification-requests', (req, res) => {
    const { userId } = req.body;
    if (!findUser(userId)) return res.status(404).send('User not found');

    const newRequest = {
        id: generateId('verificationRequest'),
        userId,
        status: 'pending',
        timestamp: new Date().toISOString(),
    };
    db.verificationRequests.push(newRequest);
    console.log('New verification request submitted:', newRequest);
    res.status(201).json(newRequest);
});



// --- SEARCH ---
router.get('/search/users', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    if (!query) return res.json([]);
    const results = db.users.filter(u => u.username.toLowerCase().includes(query) || u.name.toLowerCase().includes(query));
    res.json(results.map(u => hydrate(u, ['followers', 'following'])));
});

router.get('/search/posts', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    if (!query) return res.json([]);
    const results = db.posts.filter(p => p.caption.toLowerCase().includes(query));
    res.json(results.map(p => hydrate(p, ['user', 'likedBy', 'comments'])));
});

// --- OTHER DATA ---
// Fix: Add an endpoint to get stickers.
router.get('/stickers', (req, res) => res.json(db.stickers));
router.get('/stories', (req, res) => res.json(db.stories.map(s => hydrate(s, ['user']))));
router.get('/reels', (req, res) => res.json(db.reels.map(r => hydrate(r, ['user', 'comments', 'likedBy']))));
router.get('/activities', (req, res) => res.json(db.activities.map(a => hydrate(a, ['user', 'post']))));
router.get('/support-tickets', (req, res) => res.json(db.supportTickets));
router.get('/sponsored-content', (req, res) => res.json(db.sponsoredContent));
router.get('/trends', (req, res) => res.json(db.trendingTopics));
router.get('/premium/testimonials', (req, res) => res.json(db.testimonials.map(t => hydrate(t, ['user']))));
router.get('/help/articles', (req, res) => res.json(db.helpArticles));
router.get('/feed/activities', (req, res) => res.json(generateFeedActivities()));


export default router;