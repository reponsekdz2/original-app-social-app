import type { User, Post, Story, StoryItem, Comment, Reel, Conversation, Message, Activity, StoryHighlight, SponsoredContent, FeedActivity, Testimonial, HelpArticle, SupportTicket } from './types.ts';

// Base users - defining them first
const u1: User = {
    id: 'u1',
    username: 'movie_magic',
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?u=movie_magic',
    isVerified: true,
    isPremium: true,
    isPrivate: false,
    bio: 'Bringing you the best of cinema. 🎬\nWriter, Director, Popcorn Enthusiast.',
    website: 'https://alexrivera.film',
    gender: 'Prefer not to say',
    followers: [],
    following: [],
};

const u2: User = {
    id: 'u2',
    username: 'series_scout',
    name: 'Brenda Jones',
    avatar: 'https://i.pravatar.cc/150?u=series_scout',
    isPrivate: true,
    bio: 'Binge-watching my way through life. What should I watch next?',
    followers: [],
    following: [],
};

const u3: User = {
    id: 'u3',
    username: 'retro_reels',
    name: 'Casey Lee',
    avatar: 'https://i.pravatar.cc/150?u=retro_reels',
    isVerified: true,
    isPrivate: false,
    bio: 'Celebrating classic films and vintage vibes. 🎞️',
    followers: [],
    following: [],
};

const u4: User = {
    id: 'u4',
    username: 'indie_insights',
    name: 'Dana Smith',
    avatar: 'https://i.pravatar.cc/150?u=indie_insights',
    isPrivate: false,
    bio: 'Your source for hidden gems and independent cinema.',
    followers: [],
    following: [],
};

// Populate followers/following lists
u1.followers = [u2, u3, u4];
u1.following = [u2, u3];
u2.followers = [u1];
u2.following = [u1, u3, u4];
u3.followers = [u1, u2];
u3.following = [u1, u2];
u4.followers = [u2];
u4.following = [u1, u2];

export const MOCK_USERS: User[] = [u1, u2, u3, u4];

export const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', user: MOCK_USERS[1], text: 'This looks amazing!', timestamp: '2h', likes: 15, likedByUser: true },
    { id: 'c2', user: MOCK_USERS[2], text: 'Wow, what a classic!', timestamp: '1h', likes: 5, likedByUser: false },
    { id: 'c3', user: MOCK_USERS[3], text: 'I need to see this!', timestamp: '30m', likes: 8, likedByUser: false },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    user: MOCK_USERS[0],
    media: [
        { url: 'https://picsum.photos/id/10/1080/1080', type: 'image' },
        { url: 'https://picsum.photos/id/11/1080/1080', type: 'image' },
        { url: 'https://picsum.photos/id/12/1080/1080', type: 'image' },
    ],
    caption: 'Lost in the city lights. A selection of scenes that speak a thousand words. What movies do these remind you of?',
    likes: 1245,
    likedBy: [u2, u3],
    comments: MOCK_COMMENTS,
    timestamp: '1d',
    isSaved: false,
    isLiked: true,
    isArchived: false,
  },
  {
    id: 'p2',
    user: MOCK_USERS[1],
    media: [{ url: 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4', type: 'video' }],
    caption: 'The final season is going to be epic. Can\'t wait to see how it all ends!',
    likes: 873,
    likedBy: [u1, u4],
    comments: [],
    timestamp: '2d',
    isSaved: true,
    isLiked: false,
  },
  {
    id: 'p3',
    user: MOCK_USERS[2],
    media: [{ url: 'https://picsum.photos/id/22/1080/1350', type: 'image' }],
    caption: 'They don\'t make them like they used to. A true masterpiece from the golden age of Hollywood.',
    likes: 2300,
    likedBy: [u1, u2, u4],
    comments: [MOCK_COMMENTS[1]],
    timestamp: '3d',
    isSaved: false,
    isLiked: false,
    isArchived: true,
  }
];

const storyItems1: StoryItem[] = [
    { id: 'si1', media: 'https://picsum.photos/id/101/1080/1920', mediaType: 'image', duration: 7000 },
    { id: 'si2', media: 'https://videos.pexels.com/video-files/2099039/2099039-sd_540_960_30fps.mp4', mediaType: 'video', duration: 15000 },
];

const storyItems2: StoryItem[] = [
    { id: 'si3', media: 'https://picsum.photos/id/103/1080/1920', mediaType: 'image', duration: 7000 },
];

export const MOCK_STORIES: Story[] = [
    { id: 's1', user: MOCK_USERS[1], stories: storyItems1 },
    { id: 's2', user: MOCK_USERS[2], stories: storyItems2 },
    // Fix: Add type assertion to ensure the inline story item array matches the StoryItem[] type.
    { id: 's3', user: MOCK_USERS[3], stories: [{id: 'si4', media: 'https://picsum.photos/id/104/1080/1920', mediaType: 'image', duration: 7000}] as StoryItem[] },
].map((story): Story => ({ // Fix: Explicitly define the return type for map.
  ...story,
  user: {
    ...story.user,
    stories: story,
  },
}));

MOCK_USERS[1].stories = MOCK_STORIES[0];
MOCK_USERS[2].stories = MOCK_STORIES[1];
MOCK_USERS[3].stories = MOCK_STORIES[2];


export const MOCK_HIGHLIGHTS: StoryHighlight[] = [
    { id: 'h1', title: 'LA Trip', cover: 'https://picsum.photos/id/111/200/200', stories: storyItems1 },
    { id: 'h2', title: 'Best of 2023', cover: 'https://picsum.photos/id/112/200/200', stories: storyItems2 },
];
MOCK_USERS[0].highlights = MOCK_HIGHLIGHTS;


export const MOCK_REELS: Reel[] = [
    { id: 'r1', user: MOCK_USERS[0], video: 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4', caption: 'Epic movie moments!', likes: 12000, comments: [], isLiked: false, shares: 120, audio: { title: 'Cinematic Score', artist: 'Composer' } },
    { id: 'r2', user: MOCK_USERS[1], video: 'https://videos.pexels.com/video-files/2099039/2099039-sd_540_960_30fps.mp4', caption: 'Favorite TV show intros', likes: 8500, comments: [MOCK_COMMENTS[0]], isLiked: true, shares: 98, audio: { title: 'Catchy Theme', artist: 'TV Band' } },
];

const initialMessages: Message[] = [
    { id: 'm1', senderId: 'u2', content: 'Hey! Did you see the new trailer?', timestamp: '10:30 AM', type: 'text' },
    { id: 'm2', senderId: 'u1', content: 'I did! It looks so good!', timestamp: '10:31 AM', type: 'text' },
    { id: 'm3', senderId: 'u2', content: 'https://picsum.photos/id/237/400/300', timestamp: '10:32 AM', type: 'image' },
    { id: 'm4', senderId: 'u1', content: '#', duration: '0:15', timestamp: '10:33 AM', type: 'voicenote' },
];

initialMessages.push({
    id: 'm5',
    senderId: 'u2',
    content: 'Totally! The cinematography is stunning.',
    timestamp: '10:34 AM',
    type: 'text',
    replyTo: initialMessages[1]
});

export const MOCK_MESSAGES: Message[] = initialMessages;


export const MOCK_CONVERSATIONS: Conversation[] = [
    { id: 'conv1', participants: [MOCK_USERS[0], MOCK_USERS[1]], messages: MOCK_MESSAGES, lastMessageSeenId: 'm5' },
    { id: 'conv2', participants: [MOCK_USERS[0], MOCK_USERS[2]], messages: [{ id: 'm3', senderId: 'u2', content: 'Let\'s catch a movie this weekend', timestamp: 'Yesterday', type: 'text' }], lastMessageSeenId: 'm3' }
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'a1', type: 'like', user: MOCK_USERS[1], post: MOCK_POSTS[0], timestamp: '2h' },
    { id: 'a2', type: 'comment', user: MOCK_USERS[2], post: MOCK_POSTS[0], commentText: 'So cool!', timestamp: '3h' },
    { id: 'a3', type: 'follow', user: MOCK_USERS[3], timestamp: '5h' },
    { id: 'a4', type: 'like', user: MOCK_USERS[2], post: MOCK_POSTS[1], timestamp: '8h' },
];

export const MOCK_ADS: SponsoredContent[] = [
    {
        id: 'ad1',
        company: 'CineMax Theaters',
        logo: 'https://i.pravatar.cc/150?u=cinemax',
        media: 'https://picsum.photos/id/30/200/200',
        mediaType: 'image',
        callToAction: 'Get tickets for the latest blockbusters!',
        link: '#'
    },
    {
        id: 'ad2',
        company: 'Streamify+',
        logo: 'https://i.pravatar.cc/150?u=streamify',
        media: 'https://picsum.photos/id/40/200/200',
        mediaType: 'image',
        callToAction: 'Start your free trial for exclusive shows.',
        link: '#'
    }
];

export const MOCK_FEED_ACTIVITIES: FeedActivity[] = [
  { id: 'fa1', user: MOCK_USERS[2], action: 'liked', targetPost: MOCK_POSTS[0], timestamp: '5m' },
  { id: 'fa2', user: MOCK_USERS[3], action: 'followed', targetUser: MOCK_USERS[1], timestamp: '15m' },
  { id: 'fa3', user: MOCK_USERS[1], action: 'liked', targetPost: MOCK_POSTS[2], timestamp: '30m' },
];

export const MOCK_TRENDING_TOPICS: string[] = [
    '#TheWitcher',
    '#SquidGame2',
    '#ActionMovies',
    '#NetflixOriginal',
    '#Documentaries',
    '#ComedySpecials',
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
    {
        id: 't1',
        user: MOCK_USERS[2], // retro_reels
        quote: "The 4K uploads are a game-changer for my classic film clips. The quality is just stunning!",
    },
    {
        id: 't2',
        user: MOCK_USERS[3], // indie_insights
        quote: "As a creator, the ad-free experience helps me focus. Plus, the verified badge gives my profile that extra layer of trust.",
    },
    {
        id: 't3',
        user: MOCK_USERS[1], // series_scout
        quote: "Magic Compose is so much fun! I use it all the time to come up with witty comments. Highly recommend Premium!",
    }
];

export const MOCK_HELP_ARTICLES: HelpArticle[] = [
    { id: 'hc1', category: 'Account & Profile', title: 'How to change your password', content: 'Go to Settings > Privacy & Security > Change Password. You will be asked to enter your current password and then a new password.'},
    { id: 'hc2', category: 'Account & Profile', title: 'How to edit your profile', content: 'Navigate to your profile and tap the "Edit Profile" button to change your name, bio, website, and profile picture.'},
    { id: 'hc3', category: 'Privacy & Security', title: 'Making your account private', content: 'In Settings > Privacy & Security, you can toggle the "Private Account" switch. When your account is private, only people you approve can see your posts and stories.'},
    { id: 'hc4', category: 'Privacy & Security', title: 'What is Two-Factor Authentication?', content: 'It adds an extra layer of security to your account by requiring a second verification method when you log in from an unrecognized device.'},
    { id: 'hc5', category: 'Troubleshooting', title: 'Why is my video not uploading?', content: 'Ensure you have a stable internet connection and that the video format is supported (e.g., MP4, MOV). If the problem persists, try restarting the app.'},
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
    {
        id: 'st1',
        subject: 'Issue with video quality',
        status: 'Resolved',
        lastUpdated: '2 days ago',
        messages: [
            { sender: 'user', text: 'My videos look blurry after upload.', timestamp: '3 days ago'},
            { sender: 'support', text: 'We have identified and fixed the issue with our video processing. Please try re-uploading your video. Thank you for your patience.', timestamp: '2 days ago'},
        ]
    },
    {
        id: 'st2',
        subject: 'Cannot access my account',
        status: 'Open',
        lastUpdated: '1 hour ago',
        messages: [
             { sender: 'user', text: 'I forgot my password and I am not receiving the password reset email.', timestamp: '2 hours ago'},
             { sender: 'support', text: 'We are looking into your issue regarding email delivery and will get back to you shortly.', timestamp: '1 hour ago'},
        ]
    }
];