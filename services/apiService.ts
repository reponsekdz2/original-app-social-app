import type { User, Post, Reel, Story, Conversation, FeedActivity, SponsoredContent, Testimonial, TrendingTopic, HelpArticle, SupportTicket, StoryItem, Notification, PostMedia, Comment } from '../types.ts';

const API_BASE_URL = '/api'; // Use relative path for proxying

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
};

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
  login: (identifier: string, password: string): Promise<{user: User, token: string}> => fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) }).then(handleResponse),
  register: (data: any): Promise<{user: User, token: string}> => fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse),
  getCurrentUser: (): Promise<User> => fetch(`${API_BASE_URL}/auth/me`, { headers: getAuthHeaders() }).then(handleResponse),

  // Data fetching
  getFeed: (): Promise<{ posts: Post[], stories: Story[] }> => fetch(`${API_BASE_URL}/feed`, { headers: getAuthHeaders() }).then(handleResponse),
  getExplore: (): Promise<Post[]> => fetch(`${API_BASE_URL}/explore`).then(handleResponse),
  // Other GET requests would follow a similar pattern...

  // Posts
  createPost: (formData: FormData): Promise<Post> => fetch(`${API_BASE_URL}/posts`, { method: 'POST', headers: getAuthHeaders(), body: formData }).then(handleResponse),
  togglePostLike: (postId: string): Promise<Post> => fetch(`${API_BASE_URL}/posts/${postId}/toggle-like`, { method: 'POST', headers: getAuthHeaders() }).then(handleResponse),
  addComment: (postId: string, text: string): Promise<Post> => fetch(`${API_BASE_URL}/posts/${postId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ text }) }).then(handleResponse),
  deletePost: (postId: string): Promise<void> => fetch(`${API_BASE_URL}/posts/${postId}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse),
  
  // Reels
  toggleReelLike: (reelId: string): Promise<Reel> => fetch(`${API_BASE_URL}/reels/${reelId}/toggle-like`, { method: 'POST', headers: getAuthHeaders() }).then(handleResponse),
  postReelComment: (reelId: string, text: string): Promise<Reel> => fetch(`${API_BASE_URL}/reels/${reelId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ text }) }).then(handleResponse),
  
  // Users
  toggleFollow: (targetUserId: string): Promise<any> => fetch(`${API_BASE_URL}/users/${targetUserId}/toggle-follow`, { method: 'POST', headers: getAuthHeaders() }).then(handleResponse),
  updateUser: (formData: FormData): Promise<User> => fetch(`${API_BASE_URL}/users/profile`, { method: 'PUT', headers: getAuthHeaders(), body: formData }).then(handleResponse),
  
  // Stories
  createStory: (formData: FormData): Promise<Story> => fetch(`${API_BASE_URL}/stories`, { method: 'POST', headers: getAuthHeaders(), body: formData }).then(handleResponse),

  // Fix: Add missing API functions
  // Misc
  getStickers: (): Promise<string[]> => fetch(`${API_BASE_URL}/misc/stickers`).then(handleResponse),
  getTrending: (): Promise<TrendingTopic[]> => fetch(`${API_BASE_URL}/misc/trending`).then(handleResponse),
  getSuggestions: (): Promise<User[]> => fetch(`${API_BASE_URL}/misc/suggestions`).then(handleResponse),
  getFeedActivity: (): Promise<FeedActivity[]> => fetch(`${API_BASE_URL}/misc/feed-activity`).then(handleResponse),
  getSponsoredContent: (): Promise<SponsoredContent[]> => fetch(`${API_BASE_URL}/misc/sponsored`).then(handleResponse),
  getConversations: (): Promise<Conversation[]> => fetch(`${API_BASE_URL}/misc/conversations`).then(handleResponse),

  // AI endpoints (all need protection)
  generateCaption: (base64Data: string, mimeType: string): Promise<{caption: string}> => fetch(`${API_BASE_URL}/ai/generate-caption`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ base64Data, mimeType }) }).then(handleResponse),
  generateStoryImage: (prompt: string): Promise<{imageB64: string}> => fetch(`${API_BASE_URL}/ai/generate-story-image`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ prompt }) }).then(handleResponse),
  generateComment: (postCaption: string, style: string): Promise<{comment: string}> => fetch(`${API_BASE_URL}/ai/generate-comment`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ postCaption, style }) }).then(handleResponse),
  generateBio: (username: string, name: string): Promise<{bio: string}> => fetch(`${API_BASE_URL}/ai/generate-bio`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ username, name }) }).then(handleResponse),

};

// Simplified export for brevity in this example
export const { 
    login, register, getCurrentUser,
    getFeed, getExplore, 
    createPost, togglePostLike, addComment, deletePost,
    toggleReelLike, postReelComment,
    toggleFollow, updateUser,
    createStory,
    // Fix: Add new functions to export
    getStickers, getTrending, getSuggestions, getFeedActivity, getSponsoredContent, getConversations,
    generateCaption, generateStoryImage, generateComment, generateBio
} = apiService;
