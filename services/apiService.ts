
import type { User, Post, Reel, Story, Conversation, FeedActivity, SponsoredContent, Testimonial, TrendingTopic, HelpArticle, SupportTicket, StoryItem, Notification } from '../types.ts';

const API_BASE_URL = 'http://localhost:3000/api';

const apiService = {
  // Auth
  login: async (identifier: string, password: string): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  register: async (data: any): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  forgotPassword: async (identifier: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
  },
  resetPassword: async (identifier: string, password: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
  },
  getCurrentUser: async (id: string): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/auth/me/${id}`);
    if (!res.ok) throw new Error('User not found');
    return res.json();
  },

  // Data fetching
  getFeed: async (): Promise<{ posts: Post[], stories: Story[] }> => {
    const res = await fetch(`${API_BASE_URL}/feed`);
    if (!res.ok) throw new Error('Failed to fetch feed');
    return res.json();
  },
  getExplore: async (): Promise<Post[]> => {
    const res = await fetch(`${API_BASE_URL}/explore`);
    if (!res.ok) throw new Error('Failed to fetch explore feed');
    return res.json();
  },
  getReels: async (): Promise<Reel[]> => {
    const res = await fetch(`${API_BASE_URL}/reels`);
    if (!res.ok) throw new Error('Failed to fetch reels');
    return res.json();
  },
  getUserData: async (username: string): Promise<{user: User, posts: Post[], reels: Reel[]}> => {
      const res = await fetch(`${API_BASE_URL}/users/${username}`);
      if (!res.ok) throw new Error('User not found');
      return res.json();
  },
  getAllUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  getSidebarData: async (): Promise<{ trendingTopics: TrendingTopic[], suggestedUsers: User[], feedActivities: FeedActivity[], sponsoredContent: SponsoredContent[], conversations: Conversation[] }> => {
      const res = await fetch(`${API_BASE_URL}/sidebar`);
      if (!res.ok) throw new Error('Failed to fetch sidebar data');
      return res.json();
  },
  getConversations: async (): Promise<Conversation[]> => {
    const res = await fetch(`${API_BASE_URL}/conversations`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },
  getStickers: async (): Promise<string[]> => {
    // In a real app, these would be fetched from a CDN or API
    return Promise.resolve(['/stickers/1.png', '/stickers/2.png', '/stickers/3.png']);
  },
  getTestimonials: async(): Promise<Testimonial[]> => {
      const res = await fetch(`${API_BASE_URL}/testimonials`);
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      return res.json();
  },
  getHelpArticles: async(): Promise<HelpArticle[]> => {
      const res = await fetch(`${API_BASE_URL}/help`);
      if (!res.ok) throw new Error('Failed to fetch help articles');
      return res.json();
  },
  getSupportTickets: async(): Promise<SupportTicket[]> => {
      const res = await fetch(`${API_BASE_URL}/support`);
      if (!res.ok) throw new Error('Failed to fetch support tickets');
      return res.json();
  },
  getNotifications: async(): Promise<Notification[]> => {
    const res = await fetch(`${API_BASE_URL}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },
  getSavedPosts: async(): Promise<Post[]> => {
      const res = await fetch(`${API_BASE_URL}/saved`);
      if (!res.ok) throw new Error('Failed to fetch saved posts');
      return res.json();
  },
  getArchivedPosts: async(): Promise<Post[]> => {
      const res = await fetch(`${API_BASE_URL}/archive`);
      if (!res.ok) throw new Error('Failed to fetch archived posts');
      return res.json();
  },

  // Actions
  createPost: async (postData: any): Promise<Post> => {
     const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  createStory: async (storyItem: Omit<StoryItem, 'id'>): Promise<Story> => {
      const res = await fetch(`${API_BASE_URL}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyItem),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  // AI endpoints
  generateCaption: async (base64Data: string, mimeType: string): Promise<{caption: string}> => {
     const res = await fetch(`${API_BASE_URL}/ai/generate-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  generateStoryImage: async (prompt: string): Promise<{imageB64: string}> => {
    const res = await fetch(`${API_BASE_URL}/ai/generate-story-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  generateComment: async (postCaption: string, style: string): Promise<{comment: string}> => {
    const res = await fetch(`${API_BASE_URL}/ai/generate-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postCaption, style }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
   generateBio: async (username: string, name: string): Promise<{bio: string}> => {
    const res = await fetch(`${API_BASE_URL}/ai/generate-bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

};

export const { 
    login, register, forgotPassword, resetPassword, getCurrentUser,
    getFeed, getExplore, getReels, getUserData, getAllUsers, getSidebarData,
    getConversations, getStickers, getTestimonials, getHelpArticles, getSupportTickets,
    getNotifications, getSavedPosts, getArchivedPosts,
    createPost, createStory,
    generateCaption, generateStoryImage, generateComment, generateBio
} = apiService;
