// This file is now primarily for type exports if needed, as all mock data is being moved to the backend.

export type View = 
  'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'settings' | 
  'create' | 'notifications' | 'saved' | 'premium' | 'search' | 'activity' |
  'premium-welcome' | 'help' | 'support' | 'archive' | 'live' | 'reset-password' | 'admin';

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
  followers: User[];
  following: User[];
  stories?: Story[];
  highlights?: StoryHighlight[];
  isVerified: boolean;
  isPremium: boolean;
  isPrivate: boolean;
  isAdmin: boolean;
  notificationSettings: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
  };
  mutedUsers: string[];
  blockedUsers: string[];
  // Fix: Add optional created_at property to align with admin API response.
  created_at?: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  likedBy: User[];
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface Post {
  id: string;
  user: User;
  media: PostMedia[];
  caption: string;
  likes: number;
  likedBy: User[];
  comments: Comment[];
  savedBy: User[];
  timestamp: string;
  location?: string;
  isArchived?: boolean;
}

export interface StoryItem {
  id: string;
  media: string;
  mediaType: 'image' | 'video';
  duration: number; // in ms for images
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
  likedBy: User[];
  comments: Comment[];
  shares: number;
  timestamp: string;
}

export interface ConversationSettings {
  theme: string;
  vanish_mode_enabled: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  isGroup: boolean;
  name?: string; // For group chats
  settings: ConversationSettings;
}

export interface MessageReaction {
  emoji: string;
  user: User;
}

export interface SharedContent {
  id: string;
  type: 'post' | 'reel';
  media_url: string;
  caption: string;
  username: string;
  avatar_url: string;
}

export interface FileAttachment {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  fileType: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'sticker' | 'voicenote' | 'share_post' | 'share_reel' | 'file';
  read: boolean;
  reactions?: MessageReaction[];
  sharedContent?: SharedContent;
  fileAttachment?: FileAttachment;
}

export interface Call {
  id: string;
  caller: User;
  receiver: User;
  type: 'audio' | 'video';
  status: 'answered' | 'missed' | 'declined';
  duration: number; // in seconds
  timestamp: string;
}

export interface Notification {
    id: string;
    user: User;
    type: 'like' | 'comment' | 'follow' | 'mention' | 'tip_post';
    post?: Post;
    commentText?: string;
    timestamp: string;
    read: boolean;
}

export type Activity = Notification; // For ActivityView

export interface FeedActivity {
    id: string;
    user: User;
    action: 'liked' | 'followed';
    targetPost?: Post;
    targetUser?: User;
    timestamp: string;
}

export interface LiveStream {
    id: string;
    user: User;
    title: string;
    status: 'live' | 'ended';
    started_at: string;
}

export interface TrendingTopic {
    topic: string;
    postCount: number;
}

export interface SponsoredContent {
  id: string;
  company: string;
  logo: string;
  media: string;
  callToAction: string;
  link: string;
}

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
  lastUpdated: string;
  status: 'Open' | 'Resolved' | 'Pending';
}

export interface Report {
    id: number;
    reporter: User;
    reported_entity_id: string;
    entity_type: 'user' | 'post' | 'comment' | 'reel';
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
    created_at: string;
    reported_user?: User;
    reported_post?: Post;
}

export interface AdminStats {
    totalUsers: number;
    totalPosts: number;
    totalReels: number;
    pendingReports: number;
    liveStreams: number;
}

export interface AnalyticsData {
    labels: string[];
    values: number[];
}