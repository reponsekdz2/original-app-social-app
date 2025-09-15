export interface User {
  id: string;
  username: string;
  avatar: string;
  isVerified?: boolean;
  isPremium?: boolean;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  stories?: Story;
  highlights?: StoryHighlight[];
}

export interface StoryHighlight {
  id: string;
  title: string;
  cover: string;
  stories: StoryItem[];
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

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  user: User;
  media: string;
  mediaType: 'image' | 'video';
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isSaved: boolean;
  isLiked: boolean;
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
  }
}

export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'create' | 'notifications' | 'saved' | 'settings' | 'activity' | 'archive' | 'premium';

export interface Reaction {
    userId: string;
    emoji: string;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'voice';
    replyTo?: Message;
    reactions?: Reaction[];
}

export interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    lastMessageSeenId?: string;
}

export interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  post?: Post;
  commentText?: string;
  timestamp: string;
}
