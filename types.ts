
export type View =
  | 'home'
  | 'explore'
  | 'reels'
  | 'messages'
  | 'profile'
  | 'settings'
  | 'saved'
  | 'premium'
  | 'activity'
  | 'archive'
  | 'help'
  | 'support'
  | 'create'
  | 'notifications'
  | 'search'
  | 'premium-welcome';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  isPremium: boolean;
  isPrivate: boolean;
  bio?: string;
  website?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  followers: User[];
  following: User[];
  posts?: Post[];
  reels?: Reel[];
  stories?: Story[];
  highlights?: StoryHighlight[];
  savedPosts?: Post[];
  notificationSettings: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
  };
  mutedUsers: string[];
  blockedUsers: string[];
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
  isSaved: boolean;
  isLiked: boolean;
  isArchived: boolean;
  commentsDisabled: boolean;
}

export interface Reel {
    id: string;
    user: User;
    video: string;
    caption: string;
    likes: number;
    shares: number;
    likedBy: User[];
    comments: Comment[];
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

export interface TrendingTopic {
  topic: string;
  postCount: number;
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
  link: string;
  callToAction: string;
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
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  post?: Post;
  commentText?: string;
  timestamp: string;
  read: boolean;
}

export type Activity = Notification;

export interface Testimonial {
    id: string;
    user: User;
    quote: string;
}

export interface HelpArticle {
    id: string;
    title: string;
    content: string;
    category: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    status: 'Open' | 'Pending' | 'Resolved';
    lastUpdated: string;
}
