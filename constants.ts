// Fix: Create mock data constants for the application.
import type { User, Post, Story, Reel, Conversation, Activity, Message } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', username: 'movie_magic', avatar: 'https://i.pravatar.cc/100?u=user-1', isOnline: true, highlights: [{id: 'h1', title: 'Faves', cover: 'https://picsum.photos/seed/h1/150/150'}], isPremium: false },
  { id: 'user-2', username: 'cinephile_cat', avatar: 'https://i.pravatar.cc/100?u=user-2', isOnline: false, isPremium: false },
  { id: 'user-3', username: 'series_spectator', avatar: 'https://i.pravatar.cc/100?u=user-3', isOnline: true, isPremium: false },
  { id: 'user-4', username: 'reel_reviews', avatar: 'https://i.pravatar.cc/100?u=user-4', isOnline: false, isPremium: false },
  { id: 'user-5', username: 'netflix_nerd', avatar: 'https://i.pravatar.cc/100?u=user-5', isOnline: true, isPremium: false },
];

export const SUGGESTED_USERS: User[] = MOCK_USERS.slice(1, 5);

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    user: MOCK_USERS[1],
    media: 'https://picsum.photos/seed/post-1/600/400',
    mediaType: 'image',
    caption: 'Just watched the latest sci-fi blockbuster. Mind-blowing visuals! What did you all think?',
    likes: 1234,
    comments: [
      { id: 'c1', user: MOCK_USERS[2], text: 'Totally agree! The VFX were insane.', timestamp: '1 hour ago' },
      { id: 'c2', user: MOCK_USERS[3], text: 'I have to see it this weekend!', timestamp: '30 minutes ago' },
    ],
    timestamp: '2 hours ago',
    likedByUser: false,
    savedByUser: true,
  },
  {
    id: 'post-2',
    user: MOCK_USERS[2],
    media: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    mediaType: 'video',
    caption: 'Binge-watching this new historical drama. The costumes are incredible.',
    likes: 567,
    comments: [],
    timestamp: '5 hours ago',
    likedByUser: true,
    savedByUser: false,
  },
    {
    id: 'post-3',
    user: MOCK_USERS[3],
    media: 'https://picsum.photos/seed/post-3/600/402',
    mediaType: 'image',
    caption: 'My top 5 movies of the year so far. What are yours?',
    likes: 890,
    comments: [
       { id: 'c3', user: MOCK_USERS[0], text: 'Great list!', timestamp: '1 day ago' },
    ],
    timestamp: '1 day ago',
    likedByUser: false,
    savedByUser: false,
  },
];

export const MOCK_STORIES: Story[] = MOCK_USERS.map((user, i) => ({
  id: `story-${i+1}`,
  user: user,
  stories: [
    { id: `s${i+1}-1`, image: `https://picsum.photos/seed/s${i+1}-1/400/700`, duration: 5000 },
    { id: `s${i+1}-2`, image: `https://picsum.photos/seed/s${i+1}-2/401/701`, duration: 7000 },
  ],
}));

export const MOCK_REELS: Reel[] = [
  { id: 'reel-1', user: MOCK_USERS[1], video: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', caption: 'Hilarious movie moments!', likes: 12345, comments: 200 },
  { id: 'reel-2', user: MOCK_USERS[4], video: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', caption: 'My quick review of the new thriller.', likes: 8765, comments: 150 },
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'm1', senderId: 'user-2', content: 'Hey! Did you see the new episode?', timestamp: '10:00 AM', type: 'text' },
    { id: 'm2', senderId: 'user-1', content: 'Not yet! Planning to watch it tonight. No spoilers!', timestamp: '10:01 AM', type: 'text' },
    { id: 'm3', senderId: 'user-2', content: 'Haha, my lips are sealed. It\'s a good one though!', timestamp: '10:02 AM', type: 'text' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    { id: 'conv-1', participants: [MOCK_USERS[0], MOCK_USERS[1]], messages: MOCK_MESSAGES, lastMessageSeenId: 'm3' },
    { id: 'conv-2', participants: [MOCK_USERS[0], MOCK_USERS[2]], messages: [{id: 'm4', senderId: 'user-3', content: 'Let\'s catch up soon!', timestamp: 'Yesterday', type: 'text'}], typingUserIds: ['user-3'] },
    { id: 'conv-3', participants: [MOCK_USERS[0], MOCK_USERS[3]], messages: [{id: 'm5', senderId: 'user-4', content: 'Can I get your opinion on this trailer?', timestamp: '2 days ago', type: 'text'}] },
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'a1', type: 'like', user: MOCK_USERS[2], post: MOCK_POSTS[0], timestamp: '1 hour ago', read: false },
    { id: 'a2', type: 'comment', user: MOCK_USERS[3], post: MOCK_POSTS[0], commentText: 'Can\'t wait to watch it!', timestamp: '2 hours ago', read: false },
    { id: 'a3', type: 'follow', user: MOCK_USERS[4], timestamp: '5 hours ago', read: true },
    { id: 'a4', type: 'like', user: MOCK_USERS[1], post: MOCK_POSTS[1], timestamp: '1 day ago', read: true },
];