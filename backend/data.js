
// This file acts as a simple in-memory database.

// --- UTILITIES ---
let nextIds = {
    user: 5,
    post: 4,
    comment: 4,
    story: 4,
    storyItem: 5,
    reel: 3,
    message: 6,
    conversation: 3,
    activity: 5,
    notification: 1,
    highlight: 3,
    ticket: 3,
    verificationRequest: 1,
};

export const generateId = (type) => `${type.slice(0,1)}${nextIds[type]++}`;

export const randomTimeAgo = () => {
    const hours = Math.floor(Math.random() * 72) + 1;
    if (hours < 1) return `${Math.floor(hours*60)}m`
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
};

// --- DATABASE ---
const db = {};

// --- Users ---
// Fix: Add mutedUsers, blockedUsers, and restrictedUsers to each user object.
const u1 = { id: 'u1', username: 'movie_magic', name: 'Alex Rivera', email: 'alex@example.com', password: 'password123', phone: '123-456-7890', dob: '1990-05-15', avatar: 'https://i.pravatar.cc/150?u=movie_magic', isVerified: true, isPremium: true, isPrivate: false, bio: 'Bringing you the best of cinema. 🎬\nWriter, Director, Popcorn Enthusiast.', website: 'https://alexrivera.film', gender: 'Prefer not to say', followers: [], following: [], notificationSettings: { likes: true, comments: true, follows: true }, mutedUsers: [], blockedUsers: [], restrictedUsers: [] };
const u2 = { id: 'u2', username: 'series_scout', name: 'Brenda Jones', email: 'brenda@example.com', password: 'password123', phone: '234-567-8901', dob: '1992-08-22', avatar: 'https://i.pravatar.cc/150?u=series_scout', isPrivate: true, bio: 'Binge-watching my way through life. What should I watch next?', followers: [], following: [], notificationSettings: { likes: true, comments: true, follows: true }, mutedUsers: [], blockedUsers: [], restrictedUsers: [] };
const u3 = { id: 'u3', username: 'retro_reels', name: 'Casey Lee', email: 'casey@example.com', password: 'password123', phone: '345-678-9012', dob: '1988-11-30', avatar: 'https://i.pravatar.cc/150?u=retro_reels', isVerified: true, isPrivate: false, bio: 'Celebrating classic films and vintage vibes. 🎞️', followers: [], following: [], notificationSettings: { likes: true, comments: true, follows: true }, mutedUsers: [], blockedUsers: [], restrictedUsers: [] };
const u4 = { id: 'u4', username: 'indie_insights', name: 'Dana Smith', email: 'dana@example.com', password: 'password123', phone: '456-789-0123', dob: '1995-02-10', avatar: 'https://i.pravatar.cc/150?u=indie_insights', isPrivate: false, bio: 'Your source for hidden gems and independent cinema.', followers: [], following: [], notificationSettings: { likes: true, comments: true, follows: true }, mutedUsers: [], blockedUsers: [], restrictedUsers: [] };

db.users = [u1, u2, u3, u4];

// Populate followers/following lists
u1.followers = [u2.id, u3.id, u4.id];
u1.following = [u2.id, u3.id];
u2.followers = [u1.id];
u2.following = [u1.id, u3.id, u4.id];
u3.followers = [u1.id, u2.id];
u3.following = [u1.id, u2.id];
u4.followers = [u2.id];
u4.following = [u1.id, u2.id];

// --- Comments ---
db.comments = [
    { id: 'c1', userId: 'u2', text: 'This looks amazing!', timestamp: '2h', likes: 15, likedBy: ['u1', 'u3'], likedByUser: true }, // Liked by current user
    { id: 'c2', userId: 'u3', text: 'Wow, what a classic!', timestamp: '1h', likes: 5, likedBy: [], likedByUser: false },
    { id: 'c3', userId: 'u4', text: 'I need to see this!', timestamp: '30m', likes: 8, likedBy: [], likedByUser: false },
];

// --- Posts ---
db.posts = [
  { id: 'p1', userId: 'u1', media: [{ url: 'https://picsum.photos/id/10/1080/1080', type: 'image' }, { url: 'https://picsum.photos/id/11/1080/1080', type: 'image' }, { url: 'https://picsum.photos/id/12/1080/1080', type: 'image' }], caption: 'Lost in the city lights. A selection of scenes that speak a thousand words. What movies do these remind you of?', likes: 3, likedBy: ['u2', 'u3', 'u4'], commentIds: ['c1', 'c2', 'c3'], timestamp: '1d', isSaved: false, isLiked: true, isArchived: false, commentsDisabled: false },
  { id: 'p2', userId: 'u2', media: [{ url: 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4', type: 'video' }], caption: 'The final season is going to be epic. Can\'t wait to see how it all ends!', likes: 2, likedBy: ['u1', 'u4'], commentIds: [], timestamp: '2d', isSaved: true, isLiked: false, commentsDisabled: false },
  { id: 'p3', userId: 'u3', media: [{ url: 'https://picsum.photos/id/22/1080/1350', type: 'image' }], caption: 'They don\'t make them like they used to. A true masterpiece from the golden age of Hollywood.', likes: 3, likedBy: ['u1', 'u2', 'u4'], commentIds: ['c2'], timestamp: '3d', isSaved: false, isLiked: false, isArchived: true, commentsDisabled: false }
];

// --- Stories ---
const storyItems1 = [{ id: 'si1', media: 'https://picsum.photos/id/101/1080/1920', mediaType: 'image', duration: 7000 }, { id: 'si2', media: 'https://videos.pexels.com/video-files/2099039/2099039-sd_540_960_30fps.mp4', mediaType: 'video', duration: 15000 }];
const storyItems2 = [{ id: 'si3', media: 'https://picsum.photos/id/103/1080/1920', mediaType: 'image', duration: 7000 }];
db.stories = [
    { id: 's1', userId: 'u1', stories: [] },
    { id: 's2', userId: 'u2', stories: storyItems1 },
    { id: 's3', userId: 'u3', stories: storyItems2 },
    { id: 's4', userId: 'u4', stories: [{id: 'si4', media: 'https://picsum.photos/id/104/1080/1920', mediaType: 'image', duration: 7000}] },
];

// --- Highlights ---
db.highlights = [
    { id: 'h1', userId: 'u1', title: 'LA Trip', cover: 'https://picsum.photos/id/111/200/200', storyIds: ['si1', 'si2'] },
    { id: 'h2', userId: 'u1', title: 'Best of 2023', cover: 'https://picsum.photos/id/112/200/200', storyIds: ['si3'] },
];

// --- Reels ---
db.reels = [
    { id: 'r1', userId: 'u1', video: 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4', caption: 'Epic movie moments!', likes: 12000, commentIds: [], likedBy: ['u2', 'u3'], shares: 120, audio: { title: 'Cinematic Score', artist: 'Composer' } },
    { id: 'r2', userId: 'u2', video: 'https://videos.pexels.com/video-files/2099039/2099039-sd_540_960_30fps.mp4', caption: 'Favorite TV show intros', likes: 8500, commentIds: ['c1'], likedBy: ['u1'], shares: 98, audio: { title: 'Catchy Theme', artist: 'TV Band' } },
];

// --- Messages & Conversations ---
db.messages = [
    { id: 'm1', senderId: 'u2', content: 'Hey! Did you see the new trailer?', timestamp: '10:30 AM', type: 'text' },
    { id: 'm2', senderId: 'u1', content: 'I did! It looks so good!', timestamp: '10:31 AM', type: 'text' },
    { id: 'm3', senderId: 'u2', content: 'https://picsum.photos/id/237/400/300', timestamp: '10:32 AM', type: 'image' },
    { id: 'm4', senderId: 'u1', content: '#', duration: '0:15', timestamp: '10:33 AM', type: 'voicenote' },
    { id: 'm5', senderId: 'u2', content: 'Totally! The cinematography is stunning.', timestamp: '10:34 AM', type: 'text', replyToId: 'm2' }
];
db.conversations = [
    { id: 'conv1', participants: ['u1', 'u2'], messages: ['m1', 'm2', 'm3', 'm4', 'm5'], lastMessageSeen: { u1: 'm5', u2: 'm5' } },
    { id: 'conv2', participants: ['u1', 'u3'], messages: ['m3'], lastMessageSeen: { u1: 'm3', u3: 'm3' } }
];

// --- Activities & Notifications ---
db.activities = [
    { id: 'a1', type: 'like', userId: 'u2', postId: 'p1', timestamp: '2h' },
    { id: 'a2', type: 'comment', userId: 'u3', postId: 'p1', commentText: 'So cool!', timestamp: '3h' },
    { id: 'a3', type: 'follow', userId: 'u4', targetUserId: 'u1', timestamp: '5h' },
    { id: 'a4', type: 'like', userId: 'u3', postId: 'p2', timestamp: '8h' },
];
db.notifications = [
    { id: 'n1', type: 'like', userId: 'u2', postId: 'p1', timestamp: '2h', read: false, recipientId: 'u1' },
    { id: 'n2', type: 'comment', userId: 'u3', postId: 'p1', commentText: 'So cool!', timestamp: '3h', read: false, recipientId: 'u1' },
    { id: 'n3', type: 'follow', userId: 'u4', targetUserId: 'u1', timestamp: '5h', read: true, recipientId: 'u1' },
];

// --- Other Static Data (previously in frontend/constants.ts) ---
// Fix: Create a stickers database.
db.stickers = [
  'https://via.placeholder.com/64/ff0000/FFFFFF?text=LOL',
  'https://via.placeholder.com/64/00ff00/FFFFFF?text=OMG',
  'https://via.placeholder.com/64/0000ff/FFFFFF?text=Nice',
  'https://via.placeholder.com/64/ffff00/000000?text=Cool',
  'https://via.placeholder.com/64/ff00ff/FFFFFF?text=Wow',
  'https://via.placeholder.com/64/00ffff/FFFFFF?text=Haha',
];

db.sponsoredContent = [
    { id: 'ad1', company: 'CineMax Theaters', logo: 'https://i.pravatar.cc/150?u=cinemax', media: 'https://picsum.photos/id/30/200/200', mediaType: 'image', callToAction: 'Get tickets for the latest blockbusters!', link: '#' },
    { id: 'ad2', company: 'Streamify+', logo: 'https://i.pravatar.cc/150?u=streamify', media: 'https://picsum.photos/id/40/200/200', mediaType: 'image', callToAction: 'Start your free trial for exclusive shows.', link: '#' }
];

db.trendingTopics = [
    { topic: '#TheWitcher', postCount: 25400 },
    { topic: '#SquidGame2', postCount: 18100 },
    { topic: '#ActionMovies', postCount: 15200 },
    { topic: '#NetflixOriginal', postCount: 12800 },
    { topic: '#Documentaries', postCount: 9700 },
    { topic: '#ComedySpecials', postCount: 7300 },
];

db.testimonials = [
    { id: 't1', userId: 'u3', quote: "The 4K uploads are a game-changer for my classic film clips. The quality is just stunning!" },
    { id: 't2', userId: 'u4', quote: "As a creator, the ad-free experience helps me focus. Plus, the verified badge gives my profile that extra layer of trust." },
    { id: 't3', userId: 'u2', quote: "Magic Compose is so much fun! I use it all the time to come up with witty comments. Highly recommend Premium!" }
];

db.helpArticles = [
    { id: 'hc1', category: 'Account & Profile', title: 'How to change your password', content: 'Go to Settings > Privacy & Security > Change Password. You will be asked to enter your current password and then a new password.'},
    { id: 'hc2', category: 'Account & Profile', title: 'How to edit your profile', content: 'Navigate to your profile and tap the "Edit Profile" button to change your name, bio, website, and profile picture.'},
    { id: 'hc3', category: 'Privacy & Security', title: 'Making your account private', content: 'In Settings > Privacy & Security, you can toggle the "Private Account" switch. When your account is private, only people you approve can see your posts and stories.'},
    { id: 'hc4', category: 'Privacy & Security', title: 'What is Two-Factor Authentication?', content: 'It adds an extra layer of security to your account by requiring a second verification method when you log in from an unrecognized device.'},
    { id: 'hc5', category: 'Troubleshooting', title: 'Why is my video not uploading?', content: 'Ensure you have a stable internet connection and that the video format is supported (e.g., MP4, MOV). If the problem persists, try restarting the app.'},
];

db.supportTickets = [
    { id: 'st1', subject: 'Issue with video quality', status: 'Resolved', lastUpdated: '2 days ago', messages: [{ sender: 'user', text: 'My videos look blurry after upload.', timestamp: '3 days ago'}, { sender: 'support', text: 'We have identified and fixed the issue with our video processing. Please try re-uploading your video. Thank you for your patience.', timestamp: '2 days ago'}] },
    { id: 'st2', subject: 'Cannot access my account', status: 'Open', lastUpdated: '1 hour ago', messages: [{ sender: 'user', text: 'I forgot my password and the reset link is not working.' , timestamp: '1 hour ago'}] }
];

db.verificationRequests = [];

// --- DATA HYDRATION & ACCESSORS ---

export const findUser = (id) => db.users.find(u => u.id === id);
export const findPost = (id) => db.posts.find(p => p.id === id);
export const findReel = (id) => db.reels.find(r => r.id === id);
export const findComment = (id) => db.comments.find(c => c.id === id);
export const findMessage = (id) => db.messages.find(m => m.id === id);
export const findStoryItem = (id) => {
    for (const story of db.stories) {
        const item = story.stories.find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

export const findOrCreateConversation = (user1Id, user2Id) => {
    let convo = db.conversations.find(c => 
        c.participants.includes(user1Id) && c.participants.includes(user2Id)
    );
    if (!convo) {
        convo = {
            id: generateId('conversation'),
            participants: [user1Id, user2Id],
            messages: [],
            lastMessageSeen: {},
        };
        db.conversations.unshift(convo);
    }
    return convo;
};


export const hydrate = (obj, fields) => {
    if (!obj) return null;
    const hydrated = { ...obj };

    for (const field of fields) {
        if (field === 'user') hydrated.user = findUser(obj.userId);
        if (field === 'likedBy') hydrated.likedBy = obj.likedBy.map(findUser);
        if (field === 'comments') hydrated.comments = obj.commentIds.map(id => hydrate(db.comments.find(c => c.id === id), ['user']));
        if (field === 'stories') hydrated.stories = obj.storyIds.map(findStoryItem).filter(Boolean); // for highlights
        if (field === 'userStories') hydrated.stories = db.stories.find(s => s.userId === obj.id); // for user object
        if (field === 'highlights') hydrated.highlights = db.highlights.filter(h => h.userId === obj.id).map(h => hydrate(h, ['stories']));
        if (field === 'followers') hydrated.followers = obj.followers.map(findUser);
        if (field === 'following') hydrated.following = obj.following.map(findUser);
        if (field === 'post') hydrated.post = findPost(obj.postId);
        if (field === 'targetUser') hydrated.targetUser = findUser(obj.targetUserId);
        if (field === 'participants') hydrated.participants = obj.participants.map(findUser);
        if (field === 'messages') {
            hydrated.messages = obj.messages
                .map(findMessage)
                .filter(Boolean) // Filter out any undefined messages if an ID is invalid
                .map(m => hydrate(m, ['replyTo', 'sharedPost']));
        }
        if (field === 'replyTo') hydrated.replyTo = findMessage(obj.replyToId);
        if (field === 'sharedPost') hydrated.sharedPost = hydrate(findPost(obj.sharedPostId), ['user']);
    }
    return hydrated;
};

// --- DYNAMIC DATA GENERATION ---
export const createNotification = (data) => {
    const notif = {
        id: generateId('notification'),
        read: false,
        timestamp: randomTimeAgo(),
        ...data
    };
    db.notifications.unshift(notif);
};

export const generateFeedActivities = () => {
  const usersCopy = [...db.users];
  const postsCopy = [...db.posts];
  const activities = [];
  
  for(let i=0; i<3; i++) {
    const user = usersCopy.splice(Math.floor(Math.random() * usersCopy.length), 1)[0];
    const action = Math.random() > 0.5 ? 'liked' : 'followed';

    if (action === 'liked' && postsCopy.length > 0) {
      const targetPost = postsCopy.splice(Math.floor(Math.random() * postsCopy.length), 1)[0];
      activities.push({
        id: `fa${i}`,
        user: hydrate(user, []),
        action: 'liked',
        targetPost: hydrate(targetPost, ['user']),
        timestamp: randomTimeAgo(),
      });
    } else if (action === 'followed' && usersCopy.length > 0) {
      const targetUser = usersCopy.splice(Math.floor(Math.random() * usersCopy.length), 1)[0];
       activities.push({
        id: `fa${i}`,
        user: hydrate(user, []),
        action: 'followed',
        targetUser: hydrate(targetUser, []),
        timestamp: randomTimeAgo(),
      });
    }
  }
  return activities;
};


export default db;
