import type { User, Post, Story, Conversation, Reel, Notification } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', username: 'you', avatar: 'https://picsum.photos/seed/you/100/100', isOnline: true },
  { id: 'user-2', username: 'movie_buff', avatar: 'https://picsum.photos/seed/user2/100/100', isOnline: true },
  { id: 'user-3', username: 'series_addict', avatar: 'https://picsum.photos/seed/user3/100/100', isOnline: false },
  { id: 'user-4', username: 'stranger_things_fan', avatar: 'https://picsum.photos/seed/user4/100/100', isOnline: true },
  { id: 'user-5', username: 'the_crown_official', avatar: 'https://picsum.photos/seed/user5/100/100', isOnline: false },
  { id: 'user-6', username: 'queen_gambit_fan', avatar: 'https://picsum.photos/seed/user6/100/100', isOnline: true },
  { id: 'user-7', username: 'witcher_fanpage', avatar: 'https://picsum.photos/seed/user7/100/100', isOnline: false },
  { id: 'user-8', username: 'money_heist_lover', avatar: 'https://picsum.photos/seed/user8/100/100', isOnline: true },
];

export const SUGGESTED_USERS: User[] = MOCK_USERS.slice(3, 8);


export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    user: MOCK_USERS[1],
    image: 'https://picsum.photos/seed/post1/600/750',
    caption: 'Just watched the latest episode of The Crown. Absolutely brilliant!',
    likes: 1245,
    likedByUser: false,
    comments: [
      { id: 'comment-1', user: MOCK_USERS[2], text: 'I know, right?! So good!', timestamp: '2h ago' },
      { id: 'comment-2', user: MOCK_USERS[0], text: 'Can\'t wait to see it!', timestamp: '1h ago' },
    ],
    timestamp: '4 HOURS AGO',
  },
  {
    id: 'post-2',
    user: MOCK_USERS[2],
    image: 'https://picsum.photos/seed/post2/600/600',
    caption: 'Binge-watching Stranger Things all over again. #classic',
    likes: 587,
    likedByUser: true,
    comments: [],
    timestamp: '1 DAY AGO',
  },
   {
    id: 'post-3',
    user: MOCK_USERS[3],
    image: 'https://picsum.photos/seed/post3/600/800',
    caption: 'The upside down is calling...',
    likes: 2300,
    likedByUser: false,
    comments: [],
    timestamp: '2 DAYS AGO',
  },
  {
    id: 'post-4',
    user: MOCK_USERS[4],
    image: 'https://picsum.photos/seed/post4/600/700',
    caption: 'A truly royal affair.',
    likes: 980,
    likedByUser: false,
    comments: [],
    timestamp: '3 DAYS AGO',
  },
  {
    id: 'post-5',
    user: MOCK_USERS[0],
    image: 'https://picsum.photos/seed/mypost1/600/600',
    caption: 'My first post on Netflixgram!',
    likes: 15,
    likedByUser: true,
    comments: [],
    timestamp: '5 DAYS AGO',
  }
];

export const MOCK_STORIES: Story[] = [
  { id: 'story-1', user: MOCK_USERS[1], stories: [{id: 's1-1', image: 'https://picsum.photos/seed/story1/450/800', duration: 5000}], viewed: false },
  { id: 'story-2', user: MOCK_USERS[2], stories: [{id: 's2-1', image: 'https://picsum.photos/seed/story2/450/800', duration: 7000}], viewed: false },
  { id: 'story-3', user: MOCK_USERS[3], stories: [{id: 's3-1', image: 'https://picsum.photos/seed/story3/450/800', duration: 6000}], viewed: false },
  { id: 'story-4', user: MOCK_USERS[4], stories: [{id: 's4-1', image: 'https://picsum.photos/seed/story4/450/800', duration: 5500}], viewed: false },

];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'convo-1',
        participants: [MOCK_USERS[0], MOCK_USERS[1]],
        messages: [
            { id: 'msg-1', senderId: 'user-2', content: 'Hey, did you see the new trailer for The Witcher?', type: 'text', timestamp: '10:00 AM', reactions: [] },
            { id: 'msg-2', senderId: 'user-1', content: 'OMG yes! It looks amazing!', type: 'text', timestamp: '10:01 AM', reactions: [{userId: 'user-2', emoji: '❤️'}] },
        ],
        unreadCount: 0,
        typingUserIds: ['user-2'],
    },
    {
        id: 'convo-2',
        participants: [MOCK_USERS[0], MOCK_USERS[2]],
        messages: [
             { id: 'msg-3', senderId: 'user-3', content: 'Let\'s rewatch Money Heist this weekend!', type: 'text', timestamp: 'Yesterday', reactions: [] },
        ],
        unreadCount: 1,
    }
];

export const MOCK_REELS: Reel[] = [
    { id: 'reel-1', user: MOCK_USERS[4], videoUrl: 'https://picsum.photos/seed/reel1/540/960', caption: 'The Crown, but make it epic.', likes: 12500, comments: 342, shares: 129 },
    { id: 'reel-2', user: MOCK_USERS[6], videoUrl: 'https://picsum.photos/seed/reel2/540/960', caption: 'Toss a coin to your Witcher!', likes: 34800, comments: 987, shares: 540 },
    { id: 'reel-3', user: MOCK_USERS[7], videoUrl: 'https://picsum.photos/seed/reel3/540/960', caption: 'Bella ciao! #MoneyHeist', likes: 52100, comments: 1200, shares: 876 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', user: MOCK_USERS[1], action: 'liked', postImage: 'https://picsum.photos/seed/mypost1/50/50', timestamp: '2h' },
    { id: 'notif-2', user: MOCK_USERS[3], action: 'followed', timestamp: '3h' },
    { id: 'notif-3', user: MOCK_USERS[4], action: 'commented', postImage: 'https://picsum.photos/seed/mypost1/50/50', timestamp: '5h' },
];