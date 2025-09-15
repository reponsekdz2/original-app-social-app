export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'settings' | 'saved' | 'archive' | 'premium' | 'activity' | 'create' | 'search' | 'notifications';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  isPremium?: boolean;
  bio?: string;
  website?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  followers: User[];
  following: User[];
  stories?: Story;
  highlights?: StoryHighlight[];
}

export interface MediaItem {
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

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  likedByUser: boolean;
}

export interface Reel {
  id: string;
  user: User;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  audio: {
    title: string;
    artist: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'like';
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
