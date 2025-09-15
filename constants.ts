import type { User, Post, Story, StoryItem, Comment, Reel, Conversation, Message, Activity, StoryHighlight } from './types.ts';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'movie_magic',
    avatar: 'https://i.pravatar.cc/150?u=movie_magic',
    isVerified: true,
    isPremium: true,
    bio: 'Bringing you the best of cinema. 🎬\nWriter, Director, Popcorn Enthusiast.',
    postsCount: 134,
    followersCount: 12580,
    followingCount: 210,
  },
  {
    id: 'u2',
    username: 'series_scout',
    avatar: 'https://i.pravatar.cc/150?u=series_scout',
    bio: 'Binge-watching my way through life. What should I watch next?',
    postsCount: 58,
    followersCount: 8400,
    followingCount: 502,
  },
  {
    id: 'u3',
    username: 'retro_reels',
    avatar: 'https://i.pravatar.cc/150?u=retro_reels',
    isVerified: true,
    bio: 'Celebrating classic films and vintage vibes. 🎞️',
    postsCount: 450,
    followersCount: 22300,
    followingCount: 88,
  },
  {
    id: 'u4',
    username: 'indie_insights',
    avatar: 'https://i.pravatar.cc/150?u=indie_insights',
    bio: 'Your source for hidden gems and independent cinema.',
    postsCount: 92,
    followersCount: 6100,
    followingCount: 430,
  },
];

export const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', user: MOCK_USERS[1], text: 'This looks amazing!', timestamp: '2h' },
    { id: 'c2', user: MOCK_USERS[2], text: 'Wow, what a classic!', timestamp: '1h' },
    { id: 'c3', user: MOCK_USERS[3], text: 'I need to see this!', timestamp: '30m' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    user: MOCK_USERS[0],
    media: 'https://picsum.photos/id/10/1080/1080',
    mediaType: 'image',
    caption: 'Lost in the city lights. A scene that speaks a thousand words. What movie does this remind you of?',
    likes: 1245,
    comments: MOCK_COMMENTS,
    timestamp: '1d',
    isSaved: false,
    isLiked: true,
  },
  {
    id: 'p2',
    user: MOCK_USERS[1],
    media: 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4',
    mediaType: 'video',
    caption: 'The final season is going to be epic. Can\'t wait to see how it all ends!',
    likes: 873,
    comments: [],
    timestamp: '2d',
    isSaved: true,
    isLiked: false,
  },
  {
    id: 'p3',
    user: MOCK_USERS[2],
    media: 'https://picsum.photos/id/22/1080/1350',
    mediaType: 'image',
    caption: 'They don\'t make them like they used to. A true masterpiece from the golden age of Hollywood.',
    likes: 2300,
    comments: [MOCK_COMMENTS[1]],
    timestamp: '3d',
    isSaved: false,
    isLiked: false,
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
    { id: 's3', user: MOCK_USERS[3], stories: [{id: 'si4', media: 'https://picsum.photos/id/104/1080/1920', mediaType: 'image', duration: 7000}] },
];

export const MOCK_HIGHLIGHTS: StoryHighlight[] = [
    { id: 'h1', title: 'LA Trip', cover: 'https://picsum.photos/id/111/200/200', stories: storyItems1 },
    { id: 'h2', title: 'Best of 2023', cover: 'https://picsum.photos/id/112/200/200', stories: storyItems2 },
];

export const MOCK_REELS: Reel[] = [
    { id: 'r1', user: MOCK_USERS[0], video: 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_30fps.mp4', caption: 'Epic movie moments!', likes: 12000, comments: 45, shares: 120, audio: { title: 'Cinematic Score', artist: 'Composer' } },
    { id: 'r2', user: MOCK_USERS[1], video: 'https://videos.pexels.com/video-files/2099039/2099039-sd_540_960_30fps.mp4', caption: 'Favorite TV show intros', likes: 8500, comments: 72, shares: 98, audio: { title: 'Catchy Theme', artist: 'TV Band' } },
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'm1', senderId: 'u2', content: 'Hey! Did you see the new trailer?', timestamp: '10:30 AM', type: 'text' },
    { id: 'm2', senderId: 'u1', content: 'I did! It looks so good!', timestamp: '10:31 AM', type: 'text' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    { id: 'conv1', participants: [MOCK_USERS[0], MOCK_USERS[1]], messages: MOCK_MESSAGES, lastMessageSeenId: 'm2' },
    { id: 'conv2', participants: [MOCK_USERS[0], MOCK_USERS[2]], messages: [{ id: 'm3', senderId: 'u2', content: 'Let\'s catch a movie this weekend', timestamp: 'Yesterday', type: 'text' }], lastMessageSeenId: 'm3' }
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'a1', type: 'like', user: MOCK_USERS[1], post: MOCK_POSTS[0], timestamp: '2h' },
    { id: 'a2', type: 'comment', user: MOCK_USERS[2], post: MOCK_POSTS[0], commentText: 'So cool!', timestamp: '3h' },
    { id: 'a3', type: 'follow', user: MOCK_USERS[3], timestamp: '5h' },
];
