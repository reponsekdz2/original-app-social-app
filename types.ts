
// Fix: Removed self-import of 'User' which conflicted with the local declaration.

// Fix: Define all necessary types for the application.

export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  likedByUser: boolean;
  comments: Comment[];
  timestamp: string;
}

export interface StoryItem {
  id: string;
  image: string;
  duration: number; // in ms
}

export interface Story {
  id: string;
  user: User;
  stories: StoryItem[];
  viewed: boolean;
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export type MessageContentType = 'text' | 'image' | 'voice';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: MessageContentType;
  reactions: Reaction[];
  replyTo?: Message;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  typingUserIds?: string[];
  lastMessageSeenId?: string;
}

export interface Reel {
    id: string;
    user: User;
    videoUrl: string; // For now, we'll use picsum for images as placeholders
    caption: string;
    likes: number;
    comments: number;
    shares: number;
}

export interface Notification {
    id: string;
    user: User;
    action: 'liked' | 'commented' | 'followed';
    postImage?: string;
    timestamp: string;
}

export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile';