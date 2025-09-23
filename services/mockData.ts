
import type { User, Post, Story, TrendingTopic, FeedActivity, SponsoredContent, Conversation, Message, Comment, Reel } from '../types.ts';

// --- USERS ---
const user1: User = {
    id: '1',
    username: 'dev_user',
    name: 'Dev User',
    avatar: 'https://picsum.photos/id/1005/200/200',
    bio: 'Just a developer trying to make things work. 💻\nLoves coffee and clean code.',
    website: 'https://github.com',
    followers: [],
    following: [],
    posts: [],
    reels: [],
    stories: [],
    savedPosts: ['post2'],
    isVerified: true,
    isPrivate: false,
    isPremium: true,
    isAdmin: true,
    blockedUsers: [],
    mutedUsers: [],
    highlights: [],
    status: 'active',
    email: 'dev@example.com',
    wallet_balance: 100,
};

const user2: User = {
    id: '2',
    username: 'jane_doe',
    name: 'Jane Doe',
    avatar: 'https://picsum.photos/id/1011/200/200',
    bio: 'Traveler | Photographer | Foodie',
    followers: [],
    following: [],
    posts: [],
    reels: [],
    stories: [],
    savedPosts: [],
    isVerified: false,
    isPrivate: false,
    isPremium: false,
    isAdmin: false,
    blockedUsers: [],
    mutedUsers: [],
    status: 'active',
};

const user3: User = {
    id: '3',
    username: 'john_smith',
    name: 'John Smith',
    avatar: 'https://picsum.photos/id/1012/200/200',
    bio: 'Fitness enthusiast and life coach.',
    followers: [],
    following: [],
    posts: [],
    reels: [],
    stories: [],
    savedPosts: [],
    isVerified: true,
    isPrivate: true,
    isPremium: false,
    isAdmin: false,
    blockedUsers: [],
    mutedUsers: [],
    status: 'active',
};

const user4: User = {
    id: '4',
    username: 'art_creator',
    name: 'Art Creator',
    avatar: 'https://picsum.photos/id/1013/200/200',
    bio: 'Digital artist. Commissions open.',
    followers: [],
    following: [],
    posts: [],
    reels: [],
    stories: [],
    savedPosts: [],
    isVerified: false,
    isPrivate: false,
    isPremium: true,
    isAdmin: false,
    blockedUsers: [],
    mutedUsers: [],
    status: 'active',
}

user1.following = [user2, user3];
user2.followers = [user1];
user3.followers = [user1];

export const mockUser = user1;
export const mockSuggested = [user2, user3, user4];
export const mockAllUsers = [user1, user2, user3, user4];


// --- POSTS ---
const comment1: Comment = { id: 'c1', user: user2, text: 'This looks amazing!', timestamp: '2023-10-27T10:00:00Z', likes: 5, likedBy: [user1] };
const comment2: Comment = { id: 'c2', user: user3, text: 'Great shot!', timestamp: '2023-10-27T11:00:00Z', likes: 2, likedBy: [] };

export const mockPosts: Post[] = [
    {
        id: 'post1',
        user: user2,
        media: [{ id: 'm1', url: 'https://picsum.photos/id/237/1080/1080', type: 'image' }],
        caption: 'A beautiful day out with my best friend! #dogsofinstagram #puppylove',
        likes: 152,
        likedBy: [user1, user3],
        comments: [comment1, comment2],
        timestamp: '2023-10-27T09:00:00Z',
        location: 'Central Park, NYC',
        isSaved: false,
    },
    {
        id: 'post2',
        user: user3,
        media: [
            { id: 'm2', url: 'https://picsum.photos/id/238/1080/1350', type: 'image' },
            { id: 'm3', url: 'https://picsum.photos/id/239/1080/1350', type: 'image' }
        ],
        caption: 'Exploring the city streets. So much to see!',
        likes: 340,
        likedBy: [],
        comments: [],
        timestamp: '2023-10-26T15:30:00Z',
        isSaved: true,
        poll: {
            id: 'poll1',
            question: 'Best pizza topping?',
            options: [
                { id: 1, text: 'Pepperoni', votes: 120 },
                { id: 2, text: 'Pineapple', votes: 85 },
            ],
            userVote: null,
        }
    },
     {
        id: 'post3',
        user: user4,
        media: [{ id: 'm4', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', type: 'video' }],
        caption: 'Working on a new animation! #vfx #blender',
        likes: 58,
        likedBy: [],
        comments: [],
        timestamp: '2023-10-25T18:00:00Z',
        location: 'My Studio',
        isSaved: false,
    }
];
user2.posts = [mockPosts[0]];
user3.posts = [mockPosts[1]];
user4.posts = [mockPosts[2]];

// --- STORIES ---
export const mockStories: Story[] = [
    { id: 's1', user: user1, stories: [{ id: 'si1', media: 'https://picsum.photos/id/1/1080/1920', mediaType: 'image', duration: 7000 }] },
    { id: 's2', user: user2, stories: [{ id: 'si2', media: 'https://picsum.photos/id/2/1080/1920', mediaType: 'image' }, { id: 'si3', media: 'https://picsum.photos/id/3/1080/1920', mediaType: 'image' }] },
    { id: 's3', user: user3, stories: [{ id: 'si4', media: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', mediaType: 'video' }] }
];

// --- REELS ---
export const mockReels: Reel[] = [
    { id: 'r1', user: user2, video: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', caption: 'Fun times!', likes: 123, likedBy: [], comments: [], shares: 10, timestamp: '2023-10-27T10:00:00Z' },
    { id: 'r2', user: user3, video: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', caption: 'Workout reel', likes: 456, likedBy: [], comments: [], shares: 25, timestamp: '2023-10-27T11:00:00Z' },
];


// --- SIDEBAR ---
export const mockTrending: TrendingTopic[] = [
    { id: 1, topic: '#TechTuesday', post_count: 12500 },
    { id: 2, topic: 'React19', post_count: 9800 },
    { id: 3, topic: '#AutumnVibes', post_count: 22300 },
];

export const mockActivities: FeedActivity[] = [
    { id: 'act1', user: user2, action: 'liked', targetPost: mockPosts[1], timestamp: '2 hours ago' },
    { id: 'act2', user: user3, action: 'followed', targetUser: user4, timestamp: '5 hours ago' }
];

export const mockSponsored: SponsoredContent[] = [
    { id: 1, company: 'CodeAcademy', logo_url: 'https://picsum.photos/seed/code/200', media_url: 'https://picsum.photos/seed/codead/200', tagline: 'Learn to code interactively.', call_to_action: 'Start Learning', link: '#' }
];


// --- MESSAGES ---
export const mockConversations: Conversation[] = [
    {
        id: 'convo1',
        participants: [user1, user2],
        messages: [
            { id: 'msg1', senderId: '2', content: 'Hey! How are you?', timestamp: '2023-10-27T10:00:00Z', type: 'text', read: true },
            { id: 'msg2', senderId: '1', content: 'Doing great, thanks! Just working on this new app.', timestamp: '2023-10-27T10:01:00Z', type: 'text', read: true },
        ],
        isGroup: false,
        settings: { theme: 'default', vanish_mode_enabled: false }
    },
    {
        id: 'convo2',
        participants: [user1, user3, user4],
        messages: [
            { id: 'msg3', senderId: '3', content: 'Project meeting tomorrow?', timestamp: '2023-10-26T18:00:00Z', type: 'text', read: true }
        ],
        isGroup: true,
        name: 'Project Team',
        settings: { theme: 'sunset', vanish_mode_enabled: false }
    }
];
