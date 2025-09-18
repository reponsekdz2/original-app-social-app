// types.ts

export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'settings' | 'saved' | 'premium' | 'activity' | 'login';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  dob: string;
  bio?: string;
  website?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  isVerified: boolean;
  isPremium: boolean;
  isPrivate: boolean;
  followers: User[];
  following: User[];
  stories?: Story[];
  highlights?: StoryHighlight[];
  savedPosts?: Post[];
  archivedPosts?: Post[];
  mutedUsers: string[]; // array of user IDs
  blockedUsers: string[]; // array of user IDs
  notificationSettings: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
  };
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  likedBy: User[];
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  media: MediaItem[];
  caption: string;
  likes: number;
  likedBy: User[];
  comments: Comment[];
  timestamp: string;
  isLiked: boolean;
  isSaved: boolean;
  isArchived: boolean;
  commentsDisabled: boolean;
}

export interface Reel {
  id: string;
  user: User;
  video: string;
  caption: string;
  likes: number;
  likedBy: User[];
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  timestamp: string;
}

export interface StoryItem {
  id: string;
  media: string;
  mediaType: 'image' | 'video';
  duration: number; // in ms for images
}

export interface Story {
  id: string;
  user: User;
  stories: StoryItem[];
}

export interface StoryHighlight {
  id: string;
  title: string;
  cover: string;
  stories: StoryItem[];
}

export interface Notification {
  id: string;
  user: User;
  type: 'like' | 'comment' | 'follow' | 'mention';
  post?: Post;
  commentText?: string;
  timestamp: string;
  read: boolean;
}

export interface Activity {
  id: string;
  user: User;
  type: 'like' | 'comment' | 'follow' | 'mention';
  post?: Post;
  commentText?: string;
  timestamp: string;
}

export interface FeedActivity {
    id: string;
    user: User;
    action: 'liked' | 'followed';
    targetPost?: Post;
    targetUser?: User;
    timestamp: string;
}

export interface SponsoredContent {
  id: string;
  company: string;
  logo: string;
  media: string;
  callToAction: string;
  link: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'like' | 'sticker' | 'voicenote' | 'share';
  replyTo?: Message;
  sharedPost?: Post;
  duration?: string; // for voicenotes
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
}

export interface TrendingTopic {
    topic: string;
    postCount: number;
}

export interface Testimonial {
  id: string;
  user: User;
  quote: string;
}

export interface HelpArticle {
  id: string;
  category: string;
  title: string;
  content: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'Pending' | 'Resolved';
  lastUpdated: string;
  messages: { from: 'user' | 'support'; content: string; timestamp: string }[];
}
