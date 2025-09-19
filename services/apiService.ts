
import type { User, Post, Reel, Story, Conversation, FeedActivity, SponsoredContent, Testimonial, TrendingTopic, HelpArticle, SupportTicket, StoryItem, Notification, PostMedia } from '../types.ts';

const API_BASE_URL = 'http://localhost:3000/api';

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `HTTP error! status: ${res.status}`);
    }
    if (res.status === 204) return null; // Handle No Content response
    return res.json();
};

const apiService = {
  // Auth
  login: (identifier: string, password: string): Promise<User> => fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) }).then(handleResponse),
  register: (data: any): Promise<User> => fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse),
  forgotPassword: (identifier: string): Promise<void> => fetch(`${API_BASE_URL}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier }) }).then(handleResponse),
  resetPassword: (identifier: string, password: string): Promise<void> => fetch(`${API_BASE_URL}/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) }).then(handleResponse),
  getCurrentUser: (id: string): Promise<User> => fetch(`${API_BASE_URL}/auth/me/${id}`).then(handleResponse),

  // Data fetching
  getFeed: (): Promise<{ posts: Post[], stories: Story[] }> => fetch(`${API_BASE_URL}/feed`).then(handleResponse),
  getExplore: (): Promise<Post[]> => fetch(`${API_BASE_URL}/explore`).then(handleResponse),
  getReels: (): Promise<Reel[]> => fetch(`${API_BASE_URL}/reels`).then(handleResponse),
  getUserData: (username: string): Promise<{user: User, posts: Post[], reels: Reel[]}> => fetch(`${API_BASE_URL}/users/${username}`).then(handleResponse),
  getAllUsers: (): Promise<User[]> => fetch(`${API_BASE_URL}/users`).then(handleResponse),
  getSidebarData: (): Promise<{ trendingTopics: TrendingTopic[], suggestedUsers: User[], feedActivities: FeedActivity[], sponsoredContent: SponsoredContent[], conversations: Conversation[] }> => fetch(`${API_BASE_URL}/sidebar`).then(handleResponse),
  getConversations: (): Promise<Conversation[]> => fetch(`${API_BASE_URL}/conversations`).then(handleResponse),
  getStickers: (): Promise<string[]> => Promise.resolve(['/stickers/1.png', '/stickers/2.png', '/stickers/3.png']),
  getTestimonials: (): Promise<Testimonial[]> => fetch(`${API_BASE_URL}/testimonials`).then(handleResponse),
  getHelpArticles: (): Promise<HelpArticle[]> => fetch(`${API_BASE_URL}/help`).then(handleResponse),
  getSupportTickets: (): Promise<SupportTicket[]> => fetch(`${API_BASE_URL}/support`).then(handleResponse),
  getNotifications: (): Promise<Notification[]> => fetch(`${API_BASE_URL}/notifications`).then(handleResponse),
  getSavedPosts: (): Promise<Post[]> => fetch(`${API_BASE_URL}/saved`).then(handleResponse),
  getArchivedPosts: (): Promise<Post[]> => fetch(`${API_BASE_URL}/archive`).then(handleResponse),

  // --- NEW MUTATION APIs ---

  // Posts
  createPost: (postData: { userId: string, media: Omit<PostMedia, 'id'>[], caption: string, location: string }): Promise<Post> => fetch(`${API_BASE_URL}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(postData) }).then(handleResponse),
  togglePostLike: (postId: string, userId: string): Promise<Post> => fetch(`${API_BASE_URL}/posts/${postId}/toggle-like`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) }).then(handleResponse),
  togglePostSave: (postId: string, userId: string): Promise<Post> => fetch(`${API_BASE_URL}/posts/${postId}/toggle-save`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) }).then(handleResponse),
  addComment: (postId: string, userId: string, text: string): Promise<Post> => fetch(`${API_BASE_URL}/posts/${postId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, text }) }).then(handleResponse),
  editPost: (postId: string, updates: { caption: string, location: string }): Promise<Post> => fetch(`${API_BASE_URL}/posts/${postId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) }).then(handleResponse),
  deletePost: (postId: string): Promise<void> => fetch(`${API_BASE_URL}/posts/${postId}`, { method: 'DELETE' }).then(handleResponse),
  toggleArchivePost: (postId: string): Promise<Post> => fetch(`${API_BASE_URL}/posts/${postId}/toggle-archive`, { method: 'POST' }).then(handleResponse),

  // Reels
  toggleReelLike: (reelId: string, userId: string): Promise<Reel> => fetch(`${API_BASE_URL}/reels/${reelId}/toggle-like`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) }).then(handleResponse),
  
  // Users
  toggleFollow: (targetUserId: string, currentUserId: string): Promise<{ currentUser: User, targetUser: User }> => fetch(`${API_BASE_URL}/users/${targetUserId}/toggle-follow`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentUserId }) }).then(handleResponse),
  updateUser: (userId: string, updates: Partial<User>): Promise<User> => fetch(`${API_BASE_URL}/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) }).then(handleResponse),
  updateUserSettings: (userId: string, settings: any): Promise<User> => fetch(`${API_BASE_URL}/users/${userId}/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }).then(handleResponse),
  createHighlight: (userId: string, title: string, storyIds: string[]): Promise<User> => fetch(`${API_BASE_URL}/users/${userId}/highlights`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, storyIds }) }).then(handleResponse),

  // Stories
  createStory: (storyItem: Omit<StoryItem, 'id'>): Promise<Story> => fetch(`${API_BASE_URL}/stories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(storyItem) }).then(handleResponse),

  // AI endpoints
  generateCaption: (base64Data: string, mimeType: string): Promise<{caption: string}> => fetch(`${API_BASE_URL}/ai/generate-caption`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base64Data, mimeType }) }).then(handleResponse),
  generateStoryImage: (prompt: string): Promise<{imageB64: string}> => fetch(`${API_BASE_URL}/ai/generate-story-image`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) }).then(handleResponse),
  generateComment: (postCaption: string, style: string): Promise<{comment: string}> => fetch(`${API_BASE_URL}/ai/generate-comment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postCaption, style }) }).then(handleResponse),
  generateBio: (username: string, name: string): Promise<{bio: string}> => fetch(`${API_BASE_URL}/ai/generate-bio`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, name }) }).then(handleResponse),

};

export const { 
    login, register, forgotPassword, resetPassword, getCurrentUser,
    getFeed, getExplore, getReels, getUserData, getAllUsers, getSidebarData,
    getConversations, getStickers, getTestimonials, getHelpArticles, getSupportTickets,
    getNotifications, getSavedPosts, getArchivedPosts,
    createPost, togglePostLike, togglePostSave, addComment, editPost, deletePost, toggleArchivePost,
    toggleReelLike,
    toggleFollow, updateUser, updateUserSettings, createHighlight,
    createStory,
    generateCaption, generateStoryImage, generateComment, generateBio
} = apiService;