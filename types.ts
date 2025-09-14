
export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
  // Fix: Changed highlights to be of type StoryHighlight[] to support stories and match usage in components.
  highlights?: StoryHighlight[];
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id:string;
  user: User;
  image: string;
  caption: string;
  likes: number;
  likedByUser: boolean;
  savedByUser?: boolean;
  comments: Comment[];
  timestamp: string;
}

export interface StoryItem {
  id: string;
  image: string;
  duration: number; // in milliseconds
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


export interface Reel {
    id: string;
    user: User;
    video: string;
    caption: string;
    likes: number;
    comments: number;
}

export type MessageContentType = 'text' | 'image' | 'voice';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: MessageContentType;
  reactions?: { [emoji: string]: string[] }; // emoji -> userIds
  replyTo?: Message;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessageSeenId?: string;
  typingUserIds?: string[];
}

export interface Notification {
  id: string;
  user: User;
  action: 'liked' | 'commented' | 'followed';
  timestamp: string;
  postImage?: string;
  isRead: boolean;
}

// Fix: Removed 'id' from Highlight interface to resolve type errors indicating it was an unknown property.
export interface Highlight {
  title: string;
  cover: string;
}

export type View = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'saved' | 'settings';