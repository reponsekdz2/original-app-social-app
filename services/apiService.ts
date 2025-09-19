// Fix: Create the apiService.ts file to handle backend communication.
import type { User, Post, Comment, Reel, Story, Conversation, FeedActivity, TrendingTopic, SponsoredContent, Testimonial, HelpArticle, SupportTicket } from '../types.ts';

const BASE_URL = 'http://localhost:3000/api';

// A helper to manage the auth token
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = (): string | null => {
    return authToken;
};

// A generic fetch wrapper to handle errors and headers
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// --- Auth ---
export const login = (identifier: string, password: string): Promise<{ user: User, token: string }> => {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
    });
};

export const register = (userData: Omit<User, 'id' | 'followers' | 'following' | 'stories' | 'highlights' | 'isVerified' | 'isPremium' | 'isPrivate' | 'notificationSettings' | 'mutedUsers' | 'blockedUsers'> & { password: string }): Promise<{ user: User, token: string }> => {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

// --- Data Fetching ---
export const getFeed = (): Promise<{ posts: Post[] }> => apiFetch('/posts/feed');
export const getStories = (): Promise<{ stories: Story[] }> => apiFetch('/stories/feed');
export const getSuggestedUsers = (): Promise<{ users: User[] }> => apiFetch('/users/suggestions');
export const getExplorePosts = (): Promise<{ posts: Post[] }> => apiFetch('/posts/explore');
export const getReels = (): Promise<{ reels: Reel[] }> => apiFetch('/reels');
export const getAllUsers = (): Promise<{ users: User[] }> => apiFetch('/users/all');
export const getConversations = (): Promise<{ conversations: Conversation[] }> => apiFetch('/messages/conversations');
export const getMiscFeedData = (): Promise<{ feedActivities: FeedActivity[], trendingTopics: TrendingTopic[], sponsoredContent: SponsoredContent[] }> => apiFetch('/misc/feed-data');
export const getPremiumData = (): Promise<{ testimonials: Testimonial[] }> => apiFetch('/misc/premium-data');
export const getHelpArticles = (): Promise<{ articles: HelpArticle[] }> => apiFetch('/misc/help-articles');
export const getSupportTickets = (): Promise<{ tickets: SupportTicket[] }> => apiFetch('/misc/support-tickets');
export const getStickers = (): Promise<string[]> => apiFetch('/misc/stickers'); // For EmojiStickerPanel

// --- Actions ---
export const togglePostLike = (postId: string): Promise<{ liked: boolean }> => apiFetch(`/posts/${postId}/like`, { method: 'POST' });
export const togglePostSave = (postId: string): Promise<{ saved: boolean }> => apiFetch(`/posts/${postId}/save`, { method: 'POST' });
export const addComment = (postId: string, text: string): Promise<Comment> => apiFetch(`/posts/${postId}/comment`, { method: 'POST', body: JSON.stringify({ text }) });
export const followUser = (userId: string): Promise<{ success: boolean }> => apiFetch(`/users/${userId}/follow`, { method: 'POST' });
export const unfollowUser = (userId: string): Promise<{ success: boolean }> => apiFetch(`/users/${userId}/unfollow`, { method: 'POST' });
export const createPost = (formData: FormData): Promise<Post> => {
    // For FormData, we don't set Content-Type, fetch does it automatically
    return fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData,
    }).then(res => res.json());
};
export const createStory = (formData: FormData): Promise<Story> => {
     return fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData,
    }).then(res => res.json());
}
export const updateProfile = (formData: FormData): Promise<User> => {
    return fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData,
    }).then(res => res.json());
};

// --- AI Generation (called by geminiService) ---
export const generateCaption = (base64Data: string, mimeType: string): Promise<{ caption: string }> => {
  return apiFetch('/ai/generate-caption', {
    method: 'POST',
    body: JSON.stringify({ base64Data, mimeType }),
  });
};

export const generateStoryImage = (prompt: string): Promise<{ imageB64: string }> => {
  return apiFetch('/ai/generate-story-image', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
};

export const generateComment = (postCaption: string, style: string): Promise<{ comment: string }> => {
  return apiFetch('/ai/generate-comment', {
    method: 'POST',
    body: JSON.stringify({ postCaption, style }),
  });
};

export const generateBio = (username: string, name: string): Promise<{ bio: string }> => {
  return apiFetch('/ai/generate-bio', {
    method: 'POST',
    body: JSON.stringify({ username, name }),
  });
};
