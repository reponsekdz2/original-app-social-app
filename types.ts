export interface User {
  id: string;
  username: string;
  avatar: string;
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
  duration: number; // in milliseconds
}

export interface Story {
  id: string; // Should correspond to user.id
  user: User;
  stories: StoryItem[];
  viewed: boolean;
}

export type MessageType = 'text' | 'image' | 'voice';

export interface Message {
  id: string;
  senderId: string;
  content: string; // text, or URL for image/voice
  type: MessageType;
  timestamp: string;
  replyTo?: Message;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
}


export interface TrendingTopic {
  topic: string;
  category: string;
  posts: string;
}