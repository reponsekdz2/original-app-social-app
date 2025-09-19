// This file acts as an in-memory database for the application.
// It includes mock data and helper functions to manage it.

// --- UTILITIES ---

export const generateId = (prefix) => `${prefix}_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;

// A function to "hydrate" or populate nested data, simulating database joins.
export const hydrate = (obj, fields) => {
    if (!obj) return null;
    const hydrated = { ...obj };
    for (const field of fields) {
        if (Array.isArray(hydrated[field]) && hydrated[field].length > 0 && typeof hydrated[field][0] === 'string') {
            const tableName = field.endsWith('s') ? field : `${field}s`;
            hydrated[field] = hydrated[field].map(id => db[tableName]?.find(item => item.id === id)).filter(Boolean);
        } else if (typeof hydrated[field] === 'string' && db[`${field}s`]) {
             hydrated[field] = db[`${field}s`].find(item => item.id === hydrated[field]);
        }
    }
    return hydrated;
};

// --- MOCK DATABASE ---

const db = {
    users: [],
    posts: [],
    reels: [],
    stories: [],
    comments: [],
    notifications: [],
    conversations: [],
    messages: [],
    trendingTopics: [],
    feedActivities: [],
    sponsoredContent: [],
    testimonials: [],
    helpArticles: [],
    supportTickets: []
};

// --- DATA GENERATION ---

const createUsers = () => {
    const usernames = ['moviebuff', 'cinemafan', 'seriesqueen', 'filmguru', 'popcornprince', 'netflix_nerd', 'hbo_head', 'critic_carl', 'scene_stealer'];
    db.users = usernames.map((username, i) => ({
        id: `user_${i + 1}`,
        username,
        name: username.split('_').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        email: `${username}@example.com`,
        phone: '555-010' + i,
        dob: '1995-01-0' + (i+1),
        password: 'password123', // In a real app, this MUST be hashed.
        bio: `Just a movie lover sharing my favorite scenes.\nFollow for daily recommendations!`,
        website: 'https://letterboxd.com',
        gender: i % 2 === 0 ? 'Male' : 'Female',
        followers: [],
        following: [],
        stories: [`story_${i + 1}`],
        highlights: i < 2 ? [{ id: `highlight_${i}`, title: 'Best of 2023', cover: `https://picsum.photos/seed/${i+10}/200`, stories: [] }] : [],
        isVerified: i < 3,
        isPremium: i < 2,
        isPrivate: i === 4,
        notificationSettings: { likes: true, comments: true, follows: true },
        mutedUsers: [],
        blockedUsers: [],
    }));

    // Add current user
    const currentUser = {
        id: 'user_0',
        username: 'you',
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?u=currentuser',
        email: 'you@example.com',
        phone: '555-0199',
        dob: '1998-08-08',
        password: 'password',
        bio: 'This is your account!',
        followers: db.users.slice(0, 3).map(u => u.id),
        following: db.users.slice(3, 6).map(u => u.id),
        stories: [],
        highlights: [],
        isVerified: true,
        isPremium: true,
        isPrivate: false,
        notificationSettings: { likes: true, comments: true, follows: true },
        mutedUsers: [],
        blockedUsers: [],
    };
    db.users.unshift(currentUser);

    // Set up followers/following relationships
    db.users[0].following.forEach(id => {
        const user = db.users.find(u => u.id === id);
        if (user) user.followers.push(db.users[0].id);
    });
    db.users[0].followers.forEach(id => {
        const user = db.users.find(u => u.id === id);
        if(user) user.following.push(db.users[0].id);
    });
};

const createComments = () => {
    db.comments = [
        { id: 'comment_1', user: 'user_2', text: 'This looks amazing!', timestamp: '2h ago', likes: 5, likedBy: [] },
        { id: 'comment_2', user: 'user_3', text: 'Where was this taken?', timestamp: '1h ago', likes: 2, likedBy: [] },
        { id: 'comment_3', user: 'user_4', text: 'Incredible shot!', timestamp: '3h ago', likes: 10, likedBy: [] },
        { id: 'comment_4', user: 'user_5', text: 'Love this vibe.', timestamp: '4h ago', likes: 1, likedBy: [] },
    ];
};

const createPosts = () => {
    db.posts = db.users.map((user, i) => ({
        id: `post_${i + 1}`,
        user: user.id,
        media: [{ id: `media_${i}`, url: `https://picsum.photos/seed/${i}/800/800`, type: 'image' }],
        caption: `A beautiful moment captured. What do you think? #${['travel', 'art', 'moment', 'photography', 'life'][i % 5]}`,
        likes: i * 5 + 3,
        likedBy: db.users.slice(0, i * 5 + 3).map(u => u.id),
        comments: i % 2 === 0 ? ['comment_1', 'comment_2'] : ['comment_3', 'comment_4'],
        savedBy: i % 3 === 0 ? ['user_0'] : [],
        timestamp: `${i + 1}h ago`,
        location: ['Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK'][i % 4],
        isArchived: i > 7,
    }));
};

const createStories = () => {
    db.stories = db.users.map((user, i) => ({
        id: `story_${i + 1}`,
        user: user.id,
        stories: [
            { id: `si_${i}_1`, media: `https://picsum.photos/seed/${i+100}/540/960`, mediaType: 'image', duration: 7000 },
            { id: `si_${i}_2`, media: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', mediaType: 'video', duration: 0 },
        ]
    }));
};

const createReels = () => {
    db.reels = db.users.map((user, i) => ({
        id: `reel_${i + 1}`,
        user: user.id,
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        caption: `Reel time! Check this out.`,
        likes: i * 20 + 5,
        likedBy: db.users.slice(0, 3).map(u => u.id),
        comments: ['comment_1', 'comment_2'],
        shares: i * 3 + 1,
        timestamp: `${i + 1}d ago`,
    }));
};

const createConversations = () => {
    const currentUser = db.users[0];
    db.messages = [
      { id: 'msg1', senderId: 'user_1', content: 'Hey! Did you see that new movie?', timestamp: '10:30 AM', type: 'text', read: true },
      { id: 'msg2', senderId: currentUser.id, content: 'Not yet, was it good?', timestamp: '10:31 AM', type: 'text', read: true },
    ];
    db.conversations = [
        { id: 'convo_1', participants: [currentUser.id, 'user_1'], messages: ['msg1', 'msg2'] },
        { id: 'convo_2', participants: [currentUser.id, 'user_2'], messages: [] },
    ];
};

const createNotifications = () => {
    db.notifications = [
      { id: 'notif_1', user: 'user_2', type: 'like', post: 'post_1', timestamp: '2m', read: false },
      { id: 'notif_2', user: 'user_3', type: 'comment', post: 'post_1', commentText: 'So cool!', timestamp: '5m', read: false },
      { id: 'notif_3', user: 'user_4', type: 'follow', timestamp: '10m', read: true },
    ];
};

const createMisc = () => {
    db.trendingTopics = [{topic: '#BlockbusterSeason', postCount: 2345}, {topic: 'New Trailer Drop', postCount: 1890}];
    db.feedActivities = [{ id: 'fa_1', user: 'user_5', action: 'liked', targetPost: 'post_2', timestamp: '1h ago' }];
    db.sponsoredContent = [{id: 'ad_1', company: 'CinemaBlend', logo: '/favicon.ico', media: `https://picsum.photos/seed/ad/200`, callToAction: 'Get the latest movie news.', link: '#'}];
    db.testimonials = [{id: 'test_1', user: 'user_1', quote: 'Premium is a game-changer for creators like me!'}];
    db.helpArticles = [{id: 'help_1', title: 'How to upload 4K video', content: '...', category: 'Getting Started'}];
    db.supportTickets = [{id: 'ticket_1', subject: 'Login issue', lastUpdated: '2 days ago', status: 'Resolved'}];
};


// Initialize Data
createUsers();
createComments();
createPosts();
createStories();
createReels();
createConversations();
createNotifications();
createMisc();

export default db;
