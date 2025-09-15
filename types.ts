// Fix: Create full type definitions for the application.
export interface User {
  id: string;
  username: string;
  avatar: string;
  name: string;
  bio: string;
  followers: string[];
  following: string[];
  website?: string;
  gender?: string;
  highlights?: StoryHighlight[];
  isOnline?: boolean;
  isPremium?: boolean;
  isVerified?: boolean;
}

export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'saved' | 'settings' | 'create' | 'premium' | 'archive';

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  likedByUser: boolean;
}

export interface Post {
  id:string;
  user: User;
  media: string;
  mediaType: 'image' | 'video';
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  likedByUser: boolean;
  savedByUser: boolean;
  isArchived?: boolean;
}

export interface StoryItem {
  id: string;
  media: string;
  mediaType: 'image' | 'video';
  duration: number; // in ms
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
}

export interface Reel {
    id: string;
    user: User;
    video: string;
    caption: string;
    likes: number;
    comments: number;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id:string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice';
  reactions?: Reaction[];
  replyTo?: Message;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessageSeenId?: string;
  typingUserIds?: string[];
}

export type ActivityType = 'like' | 'comment' | 'follow' | 'mention';

export interface Activity {
  id: string;
  type: ActivityType;
  user: User;
  post?: Post;
  commentText?: string;
  timestamp: string;
  read: boolean;
}