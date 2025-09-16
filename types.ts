// Fix: Create full type definitions for the application.
export type View = 'home' | 'explore' | 'notifications' | 'messages' | 'reels' | 'saved' | 'premium' | 'profile' | 'settings' | 'activity' | 'help-center' | 'support-inbox' | 'archive' | 'premium-welcome';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  email?: string; // Made optional as it's part of auth
  password?: string; // Made optional as it's part of auth
  isVerified?: boolean;
  isPremium?: boolean;
  isPrivate: boolean;
  bio: string;
  website?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  phone?: string;
  dob?: string; // Date of Birth
  followers: User[];
  following: User[];
  stories?: Story;
  highlights?: StoryHighlight[];
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  likedByUser: boolean;
}

export interface Post {
  id: string;
  user: User;
  media: { url: string; type: 'image' | 'video' }[];
  caption: string;
  likes: number;
  likedBy: User[];
  comments: Comment[];
  timestamp: string;
  isSaved: boolean;
  isLiked: boolean;
  isArchived?: boolean;
}

export interface StoryItem {
  id: string;
  media: string;
  mediaType: 'image' | 'video';
  duration: number;
}

export interface Story {
  id:string;
  user: User;
  stories: StoryItem[];
}

export interface StoryHighlight {
    id: string;
    title: string;
    cover: string;
    stories: StoryItem[];
}

export interface Reel {
    id: string;
    user: User;
    video: string;
    caption: string;
    likes: number;
    comments: Comment[];
    isLiked: boolean;
    shares: number;
    audio?: { title: string; artist: string };
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'like' | 'voicenote' | 'sticker';
    replyTo?: Message;
    duration?: string;
}

export interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    lastMessageSeenId: string;
}

export interface Activity {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'mention';
    user: User;
    post?: Post;
    commentText?: string;
    timestamp: string;
}

export interface SponsoredContent {
    id: string;
    company: string;
    logo: string;
    media: string;
    mediaType: 'image' | 'video';
    callToAction: string;
    link: string;
}

export interface FeedActivity {
  id: string;
  user: User;
  action: 'liked' | 'followed';
  targetPost?: Post;
  targetUser?: User;
  timestamp: string;
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
    status: 'Open' | 'Resolved' | 'Pending';
    lastUpdated: string;
    messages: { sender: 'user' | 'support'; text: string; timestamp: string }[];
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
}