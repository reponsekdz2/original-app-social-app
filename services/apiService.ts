// A simple API wrapper for making requests to the backend.
import type { User, Post, Reel, Story, Comment, Conversation, Notification, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket } from '../types.ts';

const API_BASE_URL = 'http://localhost:3000/api';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

const getHeaders = (isFormData = false) => {
    const headers: Record<string, string> = {};
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
};


const handleResponse = async (response: Response) => {
    if (response.status === 204) { // No Content
        return;
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
};

const apiRequest = async (method: string, endpoint: string, body?: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : null,
    });
    return handleResponse(response);
};

// --- Auth ---
export const login = (identifier: string, password: string): Promise<{ user: User, token: string }> => {
    return apiRequest('POST', '/auth/login', { identifier, password });
};

// Fix: Changed type of userData from Partial<User> to `any` to allow for the 'password' field during registration.
export const register = (userData: any): Promise<{ user: User, token: string }> => {
    return apiRequest('POST', '/auth/register', userData);
};

export const getCurrentUser = (): Promise<{ user: User }> => {
    return apiRequest('GET', '/auth/me');
};

// --- AI ---
export const generateCaption = (base64Data: string, mimeType: string): Promise<{ caption: string }> => {
    return apiRequest('POST', '/ai/generate-caption', { base64Data, mimeType });
};

export const generateStoryImage = (prompt: string): Promise<{ imageB64: string }> => {
    return apiRequest('POST', '/ai/generate-story-image', { prompt });
};

export const generateComment = (postCaption: string, style: string): Promise<{ comment: string }> => {
    return apiRequest('POST', '/ai/generate-comment', { postCaption, style });
};

export const generateBio = (username: string, name: string): Promise<{ bio: string }> => {
    return apiRequest('POST', '/ai/generate-bio', { username, name });
};

// --- Data Fetching ---
export const getFeed = (): Promise<{ posts: Post[], stories: Story[] }> => {
    return apiRequest('GET', '/feed');
};

export const getExplorePosts = (): Promise<Post[]> => {
    return apiRequest('GET', '/explore');
};

export const getReels = (): Promise<Reel[]> => {
    return apiRequest('GET', '/reels');
};

export const getConversations = (): Promise<Conversation[]> => {
    return apiRequest('GET', '/messages');
};

export const getSidebarData = (): Promise<{
    trendingTopics: TrendingTopic[];
    suggestedUsers: User[];
    feedActivities: FeedActivity[];
    sponsoredContent: SponsoredContent[];
}> => {
    return apiRequest('GET', '/misc/sidebar-data');
};

export const getAllUsers = (): Promise<User[]> => {
    return apiRequest('GET', '/users');
};

export const getUserProfile = (username: string): Promise<{ user: User, posts: Post[], reels: Reel[] }> => {
    return apiRequest('GET', `/users/profile/${username}`);
};

export const getPremiumPageData = (): Promise<{ testimonials: Testimonial[] }> => {
    return apiRequest('GET', '/misc/premium-data');
}

export const getHelpArticles = (): Promise<HelpArticle[]> => {
    return apiRequest('GET', '/misc/help');
}

export const getSupportTickets = (): Promise<SupportTicket[]> => {
    return apiRequest('GET', '/misc/support');
}

// Fix: Added missing API service functions used in App.tsx.
export const getSavedPosts = (): Promise<Post[]> => {
    return apiRequest('GET', '/posts/saved');
};

export const getArchivedPosts = (): Promise<Post[]> => {
    return apiRequest('GET', '/posts/archived');
};

export const getNotifications = (): Promise<Notification[]> => {
    return apiRequest('GET', '/notifications');
};


// --- Posts ---
export const createPost = (formData: FormData): Promise<Post> => {
    return fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
    }).then(handleResponse);
};

export const createStory = (formData: FormData): Promise<{message: string}> => {
     return fetch(`${API_BASE_URL}/stories`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
    }).then(handleResponse);
};

export const toggleLikePost = (postId: string): Promise<{ liked: boolean, likesCount: number }> => {
    return apiRequest('POST', `/posts/${postId}/like`);
};

export const toggleLikeReel = (reelId: string): Promise<{ liked: boolean, likesCount: number }> => {
    return apiRequest('POST', `/reels/${reelId}/like`);
};

export const toggleSave = (postId: string): Promise<{ saved: boolean }> => {
    return apiRequest('POST', `/posts/${postId}/save`);
};

export const addComment = (postId: string, text: string): Promise<Comment> => {
    return apiRequest('POST', `/posts/${postId}/comment`, { text });
};

export const updateUser = (formData: FormData): Promise<User> => {
    return fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: formData,
    }).then(handleResponse);
};

export const followUser = (userId: string): Promise<{ success: boolean }> => {
    return apiRequest('POST', `/users/${userId}/follow`);
};

export const unfollowUser = (userId: string): Promise<{ success: boolean }> => {
    return apiRequest('POST', `/users/${userId}/unfollow`);
};

// This is a placeholder. Stickers would likely be a static asset or from a CDN.
export const getStickers = async (): Promise<string[]> => {
    // In a real app, this would fetch from an API endpoint.
    // For now, returning mock data.
    return Promise.resolve([
        '/stickers/sticker1.png',
        '/stickers/sticker2.png',
        '/stickers/sticker3.png',
    ]);
};