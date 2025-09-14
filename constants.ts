
import { User, Post, Comment, Story, StoryItem, Reel, Conversation, Message, Notification, StoryHighlight, Highlight } from './types';

// MOCK USERS
export const MOCK_USERS: User[] = [
  { 
    id: 'user-1', 
    username: 'the_movie_buff', 
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: true,
    highlights: [
        { id: 'h1', title: 'Sci-Fi Faves', cover: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', stories: [] },
        { id: 'h2', title: 'Horror Nights', cover: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', stories: [] },
    ]
  },
  { id: 'user-2', username: 'cinema_stan', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', isOnline: false },
  { id: 'user-3', username: 'series_addict', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', isOnline: true },
  { id: 'user-4', username: 'film_fanatic', avatar: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', isOnline: false },
  { id: 'user-5', username: 'netflix_and_chill', avatar: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', isOnline: true },
  { id: 'user-6', username: 'critic_corner', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', isOnline: false },
];

export const SUGGESTED_USERS = MOCK_USERS.slice(1);

// MOCK COMMENTS
export const MOCK_COMMENTS: Comment[] = [
  { id: 'comment-1', user: MOCK_USERS[1], text: 'Wow, great shot!', timestamp: '2h ago' },
  { id: 'comment-2', user: MOCK_USERS[2], text: 'I love this movie!', timestamp: '1h ago' },
];

// MOCK POSTS
export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    user: MOCK_USERS[0],
    image: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Just watched the new Blade Runner. Absolutely stunning visuals!',
    likes: 1245,
    likedByUser: true,
    savedByUser: true,
    comments: MOCK_COMMENTS,
    timestamp: '45m ago',
  },
  {
    id: 'post-2',
    user: MOCK_USERS[1],
    image: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Throwback to this classic. A masterpiece of cinema.',
    likes: 3489,
    likedByUser: false,
    savedByUser: false,
    comments: [MOCK_COMMENTS[0]],
    timestamp: '3h ago',
  },
   {
    id: 'post-3',
    user: MOCK_USERS[2],
    image: 'https://images.pexels.com/photos/3227984/pexels-photo-3227984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Binge-watching the latest season. Who else is hooked?',
    likes: 987,
    likedByUser: false,
    savedByUser: true,
    comments: [],
    timestamp: '1d ago',
  },
  {
    id: 'post-4',
    user: MOCK_USERS[3],
    image: 'https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'The cinematography in this is just breathtaking.',
    likes: 215,
    likedByUser: true,
    savedByUser: false,
    comments: [],
    timestamp: '2d ago',
  },
  {
    id: 'post-5',
    user: MOCK_USERS[4],
    image: 'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Movie night essentials.',
    likes: 588,
    likedByUser: false,
    savedByUser: false,
    comments: [MOCK_COMMENTS[1]],
    timestamp: '3d ago',
  },
];

// MOCK STORIES
const storyItems1: StoryItem[] = [
    { id: 'si1-1', image: 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', duration: 5000 },
    { id: 'si1-2', image: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', duration: 7000 },
];
const storyItems2: StoryItem[] = [
    { id: 'si2-1', image: 'https://images.pexels.com/photos/935949/pexels-photo-935949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', duration: 6000 },
];
export const MOCK_STORIES: Story[] = [
  { id: 'story-1', user: MOCK_USERS[0], stories: storyItems1 },
  { id: 'story-2', user: MOCK_USERS[1], stories: storyItems2 },
  { id: 'story-3', user: MOCK_USERS[2], stories: [{ id: 'si3-1', image: 'https://images.pexels.com/photos/1040499/pexels-photo-1040499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', duration: 5000 }] },
  { id: 'story-4', user: MOCK_USERS[3], stories: [{ id: 'si4-1', image: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', duration: 8000 }] },
  { id: 'story-5', user: MOCK_USERS[4], stories: [{ id: 'si5-1', image: 'https://images.pexels.com/photos/164879/pexels-photo-164879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', duration: 8000 }] },
  { id: 'story-6', user: MOCK_USERS[5], stories: [{ id: 'si6-1', image: 'https://images.pexels.com/photos/7991485/pexels-photo-7991485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', duration: 8000 }] },

];

// MOCK REELS
export const MOCK_REELS: Reel[] = [
  { id: 'reel-1', user: MOCK_USERS[3], video: 'https://assets.mixkit.co/videos/preview/mixkit-a-man-in-a-suit-works-on-a-laptop-in-a-cafe-4315-large.mp4', caption: 'Epic movie moments!', likes: 10200, comments: 156 },
  { id: 'reel-2', user: MOCK_USERS[4], video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-making-a-call-on-her-smartphone-in-a-street-outdoors-32921-large.mp4', caption: 'Behind the scenes magic.', likes: 25300, comments: 432 },
  { id: 'reel-3', user: MOCK_USERS[5], video: 'https://assets.mixkit.co/videos/preview/mixkit-man-under-a-small-waterfall-in-a-cave-1937-large.mp4', caption: 'Wait for it... 🤯', likes: 58900, comments: 1204 },

];

// MOCK NOTIFICATIONS
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', user: MOCK_USERS[1], action: 'liked', timestamp: '2m ago', postImage: MOCK_POSTS[0].image, isRead: false },
  { id: 'notif-2', user: MOCK_USERS[2], action: 'commented', timestamp: '10m ago', postImage: MOCK_POSTS[0].image, isRead: false },
  { id: 'notif-3', user: MOCK_USERS[3], action: 'followed', timestamp: '1h ago', isRead: true },
];

// MOCK MESSAGES & CONVERSATIONS
const conversation1Messages: Message[] = [
  { id: 'msg-1', senderId: 'user-2', content: 'Hey! Did you see the new trailer?', timestamp: '10:30 AM', type: 'text' },
  { id: 'msg-2', senderId: 'user-1', content: 'Yes! It looks amazing. I can\'t wait.', timestamp: '10:31 AM', type: 'text' },
  { id: 'msg-3', senderId: 'user-2', content: 'Right? The VFX are on another level.', timestamp: '10:31 AM', type: 'text', reactions: { '🤯': ['user-1'] } },
];
const replyMessage: Message = { id: 'msg-4', senderId: 'user-1', content: 'Definitely!', timestamp: '10:32 AM', type: 'text' };
conversation1Messages.push(replyMessage);


export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
    messages: conversation1Messages,
    lastMessageSeenId: 'msg-3',
    typingUserIds: ['user-2'],
  },
  {
    id: 'conv-2',
    participants: [MOCK_USERS[0], MOCK_USERS[2]],
    messages: [{ id: 'msg-5', senderId: 'user-3', content: 'Let\'s catch a movie this weekend!', timestamp: 'Yesterday', type: 'text' }],
  },
  {
    id: 'conv-3',
    participants: [MOCK_USERS[0], MOCK_USERS[3]],
    messages: [{ id: 'msg-6', senderId: 'user-4', content: 'What did you think of the finale?', timestamp: 'Yesterday', type: 'text' }],
    typingUserIds: [],
  },
];

// MOCK HIGHLIGHTS
// Fix: Removed 'id' property from mock highlights to match the updated Highlight type.
export const MOCK_HIGHLIGHTS: Highlight[] = [
    { title: 'Sci-Fi Faves', cover: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { title: 'Horror Nights', cover: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { title: 'Classics', cover: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];