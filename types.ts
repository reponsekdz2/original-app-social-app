// This file defines all the shared types used across the application.

export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'settings' | 'saved' | 'archive' | 'admin' | 'premium' | 'premium-welcome' | 'activity' | 'help' | 'support' | 'live' | 'post' | 'blocked' | 'account-status';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  website?: string;
  gender?: string;
  isPremium: boolean;
  isVerified: boolean;
  isPrivate: boolean;
  isAdmin: boolean;
  status: 'active' | 'suspended' | 'banned';
  followers: User[];
  following: User[];
  highlights?: StoryHighlight[];
  notificationSettings: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
  };
  mutedUsers: string[];
  blockedUsers: string[];
  created_at?: string;
  last_login?: string;
  wallet_balance?: number;
}

export interface PollOption {
    id: number;
    text: string;
    votes: number;
}

export interface Poll {
    id: number;
    question: string;
    options: PollOption[];
    userVote: number | null; // The ID of the option the user voted for
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface Comment {
  id: string;
  text: string;
  user: User;
  timestamp: string;
  likes: number;
  likedBy: User[];
}

export interface Post {
  id: string;
  user: User;
  collaborators: User[];
  media: PostMedia[];
  caption: string;
  location?: string;
  likes: number;
  likedBy: User[];
  comments: Comment[];
  timestamp: string;
  isSaved: boolean;
  isArchived?: boolean;
  poll?: Poll;
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

export interface StoryItem {
  id: string;
  media: string;
  mediaType: 'image' | 'video';
  duration: number;
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

export interface SharedContent {
  type: 'post' | 'reel';
  media_url: string;
  avatar_url: string;
  username: string;
}

export interface FileAttachment {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  fileType: string;
}

export interface Reaction {
  emoji: string;
  user: User;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'sticker' | 'voicenote' | 'share_post' | 'share_reel' | 'file';
  read: boolean;
  sharedContent?: SharedContent;
  fileAttachment?: FileAttachment;
  reactions?: Reaction[];
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  isGroup: boolean;
  name?: string;
  settings: {
    theme: string;
    vanish_mode_enabled: boolean;
  };
}

export interface Notification {
  id: string;
  user: User;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'collab_invite';
  commentText?: string;
  post?: Post;
  timestamp: string;
}

export interface FeedActivity {
  id: string;
  user: User;
  action: 'liked' | 'followed';
  targetUser?: User;
  targetPost?: Post;
  timestamp: string;
}

export interface SponsoredContent {
  id: number;
  company: string;
  logo_url: string;
  media_url: string;
  tagline: string;
  call_to_action: string;
  link: string;
}

export interface TrendingTopic {
    id: number;
    topic: string;
    post_count: number;
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

export interface AdminReply {
  id: number;
  message: string;
  admin_user_id: number;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  user_username: string;
  subject: string;
  description: string;
  status: 'Open' | 'Pending' | 'Resolved';
  created_at: string;
  updated_at: string;
  replies: AdminReply[];
}

export interface LiveStream {
    id: string;
    user: User;
    title: string;
    started_at: string;
}

export interface Report {
    id: number;
    reporter_id: number;
    reported_entity_id: number;
    entity_type: 'post' | 'user' | 'comment';
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
    created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalPosts: number;
  totalReels: number;
  pendingReports: number;
  liveStreams: number;
}

export interface AnalyticsData {
  labels: string[];
  values: number[];
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success';
    is_active: boolean;
    expires_at?: string;
}

export interface AuthCarouselImage {
    id: number;
    image_url: string;
    sort_order: number;
}

export interface UserWarning {
    id: number;
    reason: string;
    created_at: string;
    admin_user_id: string;
}

export interface AccountStatusInfo {
    status: User['status'];
    warnings: UserWarning[];
}