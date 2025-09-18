// This file acts as an in-memory database and provides data hydration logic.
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';

export const generateId = (prefix = '') => `${prefix}-${nanoid(10)}`;

// --- RAW DATABASE ---
let users = [
    { id: 'user-1', username: 'movie_buff_max', name: 'Max Powers', email: 'max@example.com', password: 'password123', phone: '123-456-7890', dob: '1990-05-15', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800', isVerified: true, isPremium: true, isPrivate: false, bio: 'Just a film fanatic sharing my favorite scenes. 🎬🍿\nLover of sci-fi and classic cinema.', website: 'letterboxd.com/max', gender: 'Male', followers: ['user-2', 'user-3'], following: ['user-2', 'user-3', 'user-4'], storyIds: ['story-1'], highlightIds: ['hl-1'], savedPostIds: ['post-2'], archivedPostIds: [], mutedUsers: [], blockedUsers: [], notificationSettings: { likes: true, comments: true, follows: true } },
    { id: 'user-2', username: 'cinema_chloe', name: 'Chloe Anderson', email: 'chloe@example.com', password: 'password123', phone: '123-456-7891', dob: '1992-08-20', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800', isVerified: true, isPremium: false, isPrivate: false, bio: 'Exploring the world one frame at a time. Indie film enthusiast and aspiring director.', website: '', gender: 'Female', followers: ['user-1', 'user-4'], following: ['user-1'], storyIds: ['story-2'], highlightIds: [], savedPostIds: [], archivedPostIds: [], mutedUsers: [], blockedUsers: [], notificationSettings: { likes: true, comments: true, follows: true } },
    { id: 'user-3', username: 'series_steve', name: 'Steve Miller', email: 'steve@example.com', password: 'password123', phone: '123-456-7892', dob: '1988-11-01', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800', isVerified: false, isPremium: false, isPrivate: false, bio: 'Binge-watching is my cardio. Recs welcome!', website: '', gender: 'Male', followers: ['user-1'], following: ['user-1', 'user-4'], storyIds: [], highlightIds: [], savedPostIds: [], archivedPostIds: [], mutedUsers: [], blockedUsers: [], notificationSettings: { likes: true, comments: true, follows: true } },
    { id: 'user-4', username: 'anna_edits', name: 'Anna Lee', email: 'anna@example.com', password: 'password123', phone: '123-456-7893', dob: '1995-02-25', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800', isVerified: true, isPremium: true, isPrivate: false, bio: 'Creating fan edits and video essays. Welcome to my world of visual storytelling.', website: 'youtube.com/annaedits', gender: 'Female', followers: ['user-3'], following: ['user-2'], storyIds: ['story-3'], highlightIds: [], savedPostIds: [], archivedPostIds: [], mutedUsers: [], blockedUsers: [], notificationSettings: { likes: true, comments: true, follows: true } },
];

let comments = [
    { id: 'comment-1', userId: 'user-2', text: 'Stunning shot!', timestamp: '5m', likes: 2, likedBy: ['user-1', 'user-4'], replyToId: null, replyIds: ['comment-3'] },
    { id: 'comment-2', userId: 'user-3', text: 'Classic! One of my favorites.', timestamp: '1h', likes: 0, likedBy: [], replyToId: null, replyIds: [] },
    { id: 'comment-3', userId: 'user-1', text: 'Thanks Chloe!', timestamp: '2m', likes: 1, likedBy: ['user-2'], replyToId: 'comment-1', replyIds: [] },
    { id: 'comment-4', userId: 'user-1', text: 'The cinematography here is insane.', timestamp: '10m', likes: 1, likedBy: ['user-4'], replyToId: null, replyIds: [] },
];

let posts = [
    { id: 'post-1', userId: 'user-1', media: [{ url: 'https://images.pexels.com/photos/1040499/pexels-photo-1040499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', type: 'image' }], caption: 'The calm before the storm. Love the atmosphere in this scene.', likes: 152, commentIds: ['comment-1', 'comment-2', 'comment-3'], timestamp: '2h', isArchived: false, commentsDisabled: false },
    { id: 'post-2', userId: 'user-2', media: [{ url: '/videos/production_id_4782529.mp4', type: 'video' }], caption: 'Experimenting with some new editing techniques. What do you think?', likes: 340, commentIds: [], timestamp: 'Yesterday', isArchived: false, commentsDisabled: false },
    { id: 'post-3', userId: 'user-4', media: [{ url: 'https://images.pexels.com/photos/269147/pexels-photo-269147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', type: 'image' }, { url: 'https://images.pexels.com/photos/789152/pexels-photo-789152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', type: 'image' }], caption: 'A tale of two cities. The duality of man in urban landscapes.', likes: 58, commentIds: [], timestamp: '3d', isArchived: false, commentsDisabled: false },
];

let reels = [
    { id: 'reel-1', userId: 'user-4', video: '/videos/pexels-kelly-2944185-4096x2160-25fps.mp4', caption: 'Vibes ✨', likes: 1205, commentIds: ['comment-4'], shares: 230, timestamp: '4h' },
    { id: 'reel-2', userId: 'user-1', video: '/videos/pexels-mikhail-nilov-7517671_large.mp4', caption: 'Behind the scenes magic!', likes: 893, commentIds: [], shares: 102, timestamp: '1d' },
];

let stories = [
    { id: 'story-1', userId: 'user-1', storyItems: [{ id: 'sitem-1', media: 'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=800', mediaType: 'image', duration: 7000 }] },
    { id: 'story-2', userId: 'user-2', storyItems: [{ id: 'sitem-2', media: '/videos/video (2160p).mp4', mediaType: 'video', duration: 0 }, { id: 'sitem-3', media: 'https://images.pexels.com/photos/1202726/pexels-photo-1202726.jpeg?auto=compress&cs=tinysrgb&w=800', mediaType: 'image', duration: 7000 }] },
    { id: 'story-3', userId: 'user-4', storyItems: [{ id: 'sitem-4', media: 'https://images.pexels.com/photos/7770433/pexels-photo-7770433.jpeg?auto=compress&cs=tinysrgb&w=800', mediaType: 'image', duration: 7000 }] },
];

let storyHighlights = [
    { id: 'hl-1', title: 'LA Trip', cover: 'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=800', storyItemIds: ['sitem-1'] }
];

let messages = [
    { id: generateId('msg'), conversationId: 'convo-1', senderId: 'user-2', content: 'Hey Max! Loved your latest post.', timestamp: '10:30 AM', type: 'text', replyToId: null },
    { id: generateId('msg'), conversationId: 'convo-1', senderId: 'user-1', content: 'Thanks Chloe! Appreciate it.', timestamp: '10:31 AM', type: 'text', replyToId: null },
];

let conversations = [
    { id: 'convo-1', participantIds: ['user-1', 'user-2'], messageIds: messages.filter(m => m.conversationId === 'convo-1').map(m => m.id) },
];

// --- MOCK DATA FOR SIDEBAR/OTHER MODULES ---
const trendingTopics = [
    { topic: '#TheNewMovie', postCount: 12500 }, { topic: 'Series Finale', postCount: 9800 }, { topic: '#SciFiSunday', postCount: 5400 }
];
const feedActivities = [
    { id: generateId('act'), userId: 'user-2', action: 'liked', targetPostId: 'post-1', timestamp: '15m' },
    { id: generateId('act'), userId: 'user-3', action: 'followed', targetUserId: 'user-4', timestamp: '1h' },
];
const sponsoredContent = [
    { id: 'sp-1', company: 'CinemaStream+', logo: '/sponsors/sponsor1.webp', media: '/sponsors/sponsor_media1.webp', callToAction: 'Stream now', link: '#' }
];
const testimonials = [
    { id: 'test-1', userId: 'user-4', quote: 'Premium tools unlocked my creativity. The AI features are a game-changer!' },
    { id: 'test-2', userId: 'user-1', quote: 'No ads and a verified badge? Best subscription I have.' },
];
const helpArticles = [
    { id: 'help-1', category: 'Getting Started', title: 'How to create a post?', content: 'Tap the create icon...' },
    { id: 'help-2', category: 'Account Settings', title: 'How do I change my password?', content: 'Go to Settings > Account > Change Password...' }
];
const notifications = [
    { id: generateId('notif'), userId: 'user-2', type: 'follow', timestamp: '1h', read: false },
    { id: generateId('notif'), userId: 'user-3', type: 'comment', post: posts[0], commentText: 'So cool!', timestamp: '3h', read: true },
    { id: generateId('notif'), userId: 'user-4', type: 'like', post: posts[0], timestamp: 'Yesterday', read: true },
];

// --- DATABASE OBJECT ---
const db = {
    users,
    posts,
    reels,
    comments,
    stories,
    storyHighlights,
    messages,
    conversations,
    trendingTopics,
    feedActivities,
    sponsoredContent,
    testimonials,
    helpArticles,
    notifications,
};

// --- DATA HYDRATION LOGIC ---
// This simulates a database JOIN or a GraphQL resolver.
export const hydrate = (item, fieldsToHydrate) => {
    if (!item) return null;
    if (Array.isArray(item)) return item.map(i => hydrate(i, fieldsToHydrate));

    const hydratedItem = { ...item };

    for (const field of fieldsToHydrate) {
        if (field === 'user' && item.userId) {
            hydratedItem.user = hydrate(db.users.find(u => u.id === item.userId), ['followers', 'following']);
        }
        else if (field === 'followers' && item.followers) {
            hydratedItem.followers = item.followers.map(id => db.users.find(u => u.id === id));
        }
        else if (field === 'following' && item.following) {
            hydratedItem.following = item.following.map(id => db.users.find(u => u.id === id));
        }
        else if (field === 'likedBy' && item.likedBy) {
            hydratedItem.likedBy = item.likedBy.map(id => db.users.find(u => u.id === id));
        }
        else if (field === 'stories' && item.storyIds) {
            hydratedItem.stories = hydrate(db.stories.filter(s => item.storyIds.includes(s.id)), ['user', 'storyItems']);
        }
        else if (field === 'storyItems' && item.storyItems) { // for single story
            hydratedItem.stories = item.storyItems;
        }
        else if (field === 'highlights' && item.highlightIds) {
            hydratedItem.highlights = hydrate(db.storyHighlights.filter(h => item.highlightIds.includes(h.id)), ['stories']);
        }
        else if (field === 'comments' && item.commentIds) {
            const topLevelComments = db.comments.filter(c => item.commentIds.includes(c.id) && !c.replyToId);
            hydratedItem.comments = hydrate(topLevelComments, ['user', 'likedBy', 'replies']);
        }
        else if (field === 'replies' && item.replyIds) {
            const replies = db.comments.filter(c => item.replyIds.includes(c.id));
            hydratedItem.replies = hydrate(replies, ['user', 'likedBy', 'replies']); // recursive
        }
         else if (field === 'participants' && item.participantIds) {
            hydratedItem.participants = hydrate(item.participantIds.map(id => db.users.find(u => u.id === id)), []);
        }
        else if (field === 'messages' && item.messageIds) {
            const msgs = item.messageIds.map(id => db.messages.find(m => m.id === id)).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
            hydratedItem.messages = hydrate(msgs, ['replyTo', 'sharedPost']);
        }
        else if (field === 'replyTo' && item.replyToId) {
            hydratedItem.replyTo = db.messages.find(m => m.id === item.replyToId);
        }
        else if (field === 'sharedPost' && item.sharedPostId) {
             hydratedItem.sharedPost = hydrate(db.posts.find(p => p.id === item.sharedPostId), ['user']);
        }
    }

    return hydratedItem;
};

export default db;
