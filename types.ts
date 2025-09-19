
export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'settings' | 'post' | 'create' | 'notifications' | 'search' | 'saved' | 'live' | 'admin' | 'premium' | 'premium-welcome' | 'activity' | 'archive' | 'help' | 'support';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  website?: string;
  followers: User[];
  following: User[];
  posts: Post[];
  reels: Reel[];
  stories: Story[];
  saved: Post[];
  highlights?: StoryHighlight[];
  isVerified: boolean;
  isPrivate: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  created_at?: string;
  notificationSettings: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
  };
  mutedUsers: string[];
  blockedUsers: string[];
}

export interface Reaction {
  emoji: string;
  user: User;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface Post {
  id: string;
  user: User;
  media: Media[];
  caption: string;
  location?: string;
  likes: number;
  likedBy: User[];
  comments: Comment[];
  timestamp: string;
  isSaved: boolean;
  isArchived?: boolean;
}

export interface Reel {
    id: string;
    user: User;
    video: string;
    caption: string;
    audio?: string;
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
  duration?: number; // in ms
  link?: string;
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
    id: string;
    username: string;
    avatar_url: string;
    media_url: string;
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
  read: boolean;
  type: 'text' | 'image' | 'video' | 'sticker' | 'voicenote' | 'share_post' | 'share_reel' | 'file';
  reactions?: Reaction[];
  replyTo?: string;
  sharedContent?: SharedContent;
  fileAttachment?: FileAttachment;
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
    user: User; // The user who performed the action
    type: 'like' | 'comment' | 'follow' | 'mention' | 'tip';
    post?: Post;
    commentText?: string;
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
    is_active: boolean;
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
    admin_id: string;
    message: string;
    created_at: string;
    admin_username?: string; // To be joined on the frontend
}

export interface SupportTicket {
    id: number;
    user_id: string;
    subject: string;
    description: string;
    status: 'Open' | 'Pending' | 'Resolved';
    created_at: string;
    updated_at: string;
    user_username?: string; // To be joined
    replies: AdminReply[];
}


export interface LiveStream {
    id: string;
    user: User;
    title: string;
    viewers: number;
}

// Admin types
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

export interface Report {
    id: number;
    reporter_id: number;
    reported_entity_id: number;
    entity_type: 'post' | 'user' | 'comment' | 'reel';
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
    created_at: string;
    reporter_username: string;
    reported_username?: string;
    reported_post_caption?: string;
}
