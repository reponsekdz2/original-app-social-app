export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'settings' | 'saved' | 'archive' | 'activity' | 'premium' | 'admin' | 'changePassword' | 'blockedUsers' | 'loginActivity' | 'accountStatus' | 'help' | 'support_inbox' | 'faq' | 'privacy' | 'tag' | 'livestreams';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar_url: string;
  bio?: string;
  website?: string;
  isVerified: boolean;
  isPremium: boolean;
  isPrivate: boolean;
  isAdmin: boolean;
  post_count?: number;
  follower_count?: number;
  following_count?: number;
  followers?: User[];
  following?: User[];
  posts?: Post[];
  reels?: Reel[];
  highlights?: StoryHighlight[];
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  wallet_balance?: number;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: string; // Changed to string to match UUIDs
  question: string;
  options: PollOption[];
  userVote: number | null;
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
  isSaved: boolean;
  isArchived?: boolean;
  timestamp: string;
  poll?: Poll;
  tags?: string[];
}

export interface Reel {
  id: string;
  user: User;
  video_url: string;
  caption: string;
  likes: number;
  likedBy: User[];
  comments: Comment[];
  shares: number;
  timestamp: string;
  tags?: string[];
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  likes: number;
  timestamp: string;
}

export interface StoryItem {
  id: string;
  media_url: string;
  mediaType: 'image' | 'video';
  duration?: number;
}

export interface Story {
  id: string;
  user: User;
  items: StoryItem[];
  created_at: string;
}

export interface StoryHighlight {
    id: string;
    title: string;
    cover: string;
}

export interface Conversation {
  id: string;
  name?: string;
  participants: User[];
  messages: Message[];
  isGroup: boolean;
  theme?: string;
}

export interface Reaction {
    emoji: string;
    user: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  senderId: string;
  sender?: User;
  content: string;
  type: 'text' | 'image' | 'sticker' | 'voicenote' | 'share_post' | 'share_reel' | 'file';
  timestamp: string;
  reactions: Reaction[];
  replyTo?: {
      sender: string;
      content: string;
  };
  sharedContent?: {
      username: string;
      avatar_url: string;
      media_url: string;
  },
  fileAttachment?: {
      fileName: string;
      fileSize: number;
      fileUrl: string;
  }
}

export interface Notification {
  id: string;
  actor: User;
  type: 'like_post' | 'comment_post' | 'follow' | 'like_reel' | 'comment_reel' | 'mention';
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
}

export interface TrendingTopic {
    id: number;
    topic: string;
    post_count: number;
}

export interface AuthCarouselImage {
    id: number;
    image_url: string;
}

// FIX: Export the ToastMessage type
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
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

export interface Report {
    id: number;
    reporter_id: string;
    reported_entity_id: string;
    entity_type: 'user' | 'post' | 'comment' | 'reel';
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
}

export interface SupportTicket {
    id: number;
    user_id: string;
    user_username: string;

    subject: string;
    description: string;
    status: 'Open' | 'Pending' | 'Resolved';
    created_at: string;
    updated_at: string;
}

export interface AdminReply {
    id: number;
    ticket_id: number;
    admin_user_id: string;
    message: string;
    created_at: string;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success';
    is_active: boolean;
}

export interface AccountStatusInfo {
    status: 'active' | 'suspended' | 'banned';
    warnings: { id: number; reason: string; created_at: string }[];
}

export interface LiveStream {
    id: string;
    user: User;
    title: string;
    status: 'live' | 'ended';
    started_at: string;
}

export interface Call {
    id: string;
    other_user: User;
    type: 'audio' | 'video';
    status: 'completed' | 'missed' | 'declined';
    started_at: string;
    duration_seconds: number;
    was_outgoing: boolean;
}