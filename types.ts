// Fix: Create full type definitions
export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  website?: string;
  followers: User[];
  following: User[];
  posts: Post[];
  reels: Reel[];
  stories: Story[];
  savedPosts: string[];
  isVerified: boolean;
  isPrivate: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  blockedUsers: string[];
  mutedUsers: string[];
  highlights?: StoryHighlight[];
  status: 'active' | 'suspended' | 'banned';
  email?: string;
  wallet_balance?: number;
  last_login?: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  likedBy: User[];
  reactions?: Reaction[];
}

export interface Reaction {
    emoji: string;
    user: User;
}

export interface PollOption {
    id: number;
    text: string;
    votes: number;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    userVote: number | null;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
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
  location?: string;
  isSaved: boolean;
  poll?: Poll;
  isArchived?: boolean;
}

export interface StoryItem {
  id: string;
  media: string;
  mediaType: 'image' | 'video';
  duration?: number;
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

export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'create' | 'notifications' | 'saved' | 'settings' | 'activity' | 'archive' | 'search' | 'admin' | 'premium' | 'live';

export interface TrendingTopic {
    id: number;
    topic: string;
    post_count: number;
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
    id: number;
    company: string;
    logo_url: string;
    media_url: string;
    tagline: string;
    call_to_action: string;
    link: string;
}

export interface SharedContent {
    type: 'post' | 'reel';
    id: string;
    media_url: string;
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
    reactions?: Reaction[];
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

export interface Notification {
  id: string;
  user: User;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'collab_invite';
  post?: Post;
  commentText?: string;
  timestamp: string;
}

export interface SupportTicket {
  id: number;
  user_username: string;
  subject: string;
  description: string;
  status: 'Open' | 'Pending' | 'Resolved';
  created_at: string;
  updated_at: string;
  replies: AdminReply[];
}

export interface AdminReply {
    id: number;
    ticket_id: number;
    admin_user_id: string;
    message: string;
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

export interface AccountStatusInfo {
    status: 'active' | 'suspended' | 'banned';
    warnings: { id: number; reason: string; created_at: string }[];
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success';
    is_active: boolean;
    expires_at: string | null;
}

export interface AuthCarouselImage {
    id: number;
    image_url: string;
    sort_order: number;
}

export interface LiveStream {
    id: string;
    user: User;
    title: string;
    started_at: string;
    status: 'live' | 'ended';
}

export interface Report {
    id: number;
    reporter_id: string;
    reported_entity_id: string;
    entity_type: 'post' | 'user' | 'reel' | 'comment';
    reason: string;
    details?: string;
    status: 'pending' | 'resolved' | 'dismissed';
    created_at: string;
}
