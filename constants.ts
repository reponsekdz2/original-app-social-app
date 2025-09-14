import type { User, Post, Story, Comment, Conversation, Message } from './types';

const USERS_LIST: User[] = [
  { id: 'user0', username: 'You', avatar: 'https://picsum.photos/seed/you/100/100' },
  { id: 'user1', username: 'movie_buff', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user2', username: 'series_streamer', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user3', username: 'binge_watcher', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'user4', username: 'cinema_critic', avatar: 'https://picsum.photos/seed/user4/100/100' },
  { id: 'user5', username: 'reel_reviews', avatar: 'https://picsum.photos/seed/user5/100/100' },
  { id: 'user6', username: 'new_movies', avatar: 'https://picsum.photos/seed/user6/100/100' },
  { id: 'user7', username: 'classic_films', avatar: 'https://picsum.photos/seed/user7/100/100' },
  { id: 'user8', username: 'indie_gems', avatar: 'https://picsum.photos/seed/user8/100/100' },
];

export const ALL_USERS = USERS_LIST;
export const CURRENT_USER: User = USERS_LIST[0];
const USERS = USERS_LIST.slice(1); // Exclude 'You' for posts, stories etc.


const generateComments = (postId: string): Comment[] => [
  { id: `${postId}-comment1`, user: USERS[2], text: 'This looks amazing! 🔥', timestamp: '2h ago' },
  { id: `${postId}-comment2`, user: USERS[3], text: 'Great shot!', timestamp: '1h ago' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    user: USERS[0],
    image: 'https://picsum.photos/seed/post1/800/1000',
    caption: 'Exploring the neon-lit streets of a cyberpunk city. The future is now.',
    likes: 1247,
    likedByUser: false,
    comments: generateComments('post1'),
    timestamp: '4 HOURS AGO',
  },
  {
    id: 'post2',
    user: USERS[1],
    image: 'https://picsum.photos/seed/post2/800/800',
    caption: 'Quiet mornings and a good book. What are you reading this weekend?',
    likes: 832,
    likedByUser: true,
    comments: generateComments('post2'),
    timestamp: '1 DAY AGO',
  },
  {
    id: 'post3',
    user: USERS[2],
    image: 'https://picsum.photos/seed/post3/800/900',
    caption: 'Conquered the peak! The view from the top was worth every step. 🏔️',
    likes: 2041,
    likedByUser: false,
    comments: generateComments('post3'),
    timestamp: '2 DAYS AGO',
  },
    {
    id: 'post4',
    user: USERS[3],
    image: 'https://picsum.photos/seed/post4/800/1100',
    caption: 'Street art is the soul of the city.',
    likes: 540,
    likedByUser: false,
    comments: generateComments('post4'),
    timestamp: '3 DAYS AGO',
  },
];

export const MOCK_STORIES: Story[] = [
  { 
    id: 'story1', user: USERS[0], viewed: false, stories: [
      { id: 's1-1', image: 'https://picsum.photos/seed/s1-1/1080/1920', duration: 5000 },
      { id: 's1-2', image: 'https://picsum.photos/seed/s1-2/1080/1920', duration: 5000 },
    ] 
  },
  { 
    id: 'story2', user: USERS[1], viewed: false, stories: [
      { id: 's2-1', image: 'https://picsum.photos/seed/s2-1/1080/1920', duration: 7000 },
    ]
  },
  { 
    id: 'story3', user: USERS[2], viewed: true, stories: [
      { id: 's3-1', image: 'https://picsum.photos/seed/s3-1/1080/1920', duration: 5000 },
      { id: 's3-2', image: 'https://picsum.photos/seed/s3-2/1080/1920', duration: 5000 },
      { id: 's3-3', image: 'https://picsum.photos/seed/s3-3/1080/1920', duration: 5000 },
    ]
  },
  { id: 'story4', user: USERS[3], viewed: true, stories: [{ id: 's4-1', image: 'https://picsum.photos/seed/s4-1/1080/1920', duration: 6000 }] },
  { id: 'story5', user: USERS[4], viewed: true, stories: [{ id: 's5-1', image: 'https://picsum.photos/seed/s5-1/1080/1920', duration: 5000 }] },
  { id: 'story6', user: USERS[5], viewed: false, stories: [{ id: 's6-1', image: 'https://picsum.photos/seed/s6-1/1080/1920', duration: 5000 }] },
  { id: 'story7', user: USERS[6], viewed: true, stories: [{ id: 's7-1', image: 'https://picsum.photos/seed/s7-1/1080/1920', duration: 8000 }] },
  { id: 'story8', user: USERS[7], viewed: false, stories: [{ id: 's8-1', image: 'https://picsum.photos/seed/s8-1/1080/1920', duration: 5000 }] },
];

export const SUGGESTED_USERS: User[] = [USERS[2], USERS[3], USERS[4]];

// FIX: The `conversation1Messages` variable was used inside its own declaration, which is not allowed.
// The declaration has been split to define the array first, then push the element that references the array.
const conversation1Messages: Message[] = [
    { id: 'm1-1', senderId: 'user1', type: 'text', content: 'Hey! Did you see the latest episode of "Starfall"? It was insane!', timestamp: '10:30 AM' },
    { id: 'm1-2', senderId: 'user0', type: 'text', content: 'No, not yet! Don\'t spoil it for me! 😂', timestamp: '10:31 AM' },
    { id: 'm1-3', senderId: 'user1', type: 'image', content: 'https://picsum.photos/seed/convo1/400/300', timestamp: '10:32 AM'},
    { id: 'm1-4', senderId: 'user1', type: 'text', content: 'Okay okay, no spoilers. But check out this still from the trailer.', timestamp: '10:32 AM'},
];
conversation1Messages.push({ id: 'm1-5', senderId: 'user0', type: 'text', content: 'Whoa, that looks epic! Can\'t wait to watch it tonight.', timestamp: '10:35 AM', replyTo: conversation1Messages[3] });

const conversation2Messages: Message[] = [
    { id: 'm2-1', senderId: 'user2', type: 'text', content: 'Are we still on for the movie marathon this weekend?', timestamp: 'Yesterday' },
    { id: 'm2-2', senderId: 'user0', type: 'text', content: 'Absolutely! I\'ve got the popcorn ready.', timestamp: 'Yesterday' },
];

const conversation3Messages: Message[] = [
    { id: 'm3-1', senderId: 'user4', type: 'voice', content: '#', timestamp: '3 days ago' },
    { id: 'm3-2', senderId: 'user0', type: 'text', content: 'Got it, sounds like a plan!', timestamp: '3 days ago' },
];


export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'convo1',
    participants: [USERS_LIST[0], USERS_LIST[1]],
    messages: conversation1Messages,
    unreadCount: 2,
  },
  {
    id: 'convo2',
    participants: [USERS_LIST[0], USERS_LIST[2]],
    messages: conversation2Messages,
    unreadCount: 0,
  },
  {
    id: 'convo3',
    participants: [USERS_LIST[0], USERS_LIST[4]],
    messages: conversation3Messages,
    unreadCount: 0,
  },
    {
    id: 'convo4',
    participants: [USERS_LIST[0], USERS_LIST[5]],
    messages: [{id: 'm4-1', senderId: 'user5', type: 'text', content: 'Let\'s catch up soon!', timestamp: 'Last week'}],
    unreadCount: 1,
  },
];