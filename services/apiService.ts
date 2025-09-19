// This file handles all communication with the backend API.
import type { User, Post, Comment, Reel, Story, Conversation, FeedActivity, TrendingTopic, SponsoredContent, Testimonial, HelpArticle, SupportTicket, Message, StoryHighlight, Notification } from '../types.ts';

const BASE_URL = 'http://localhost:3000/api';

let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = (): string | null => authToken;

const getAuthHeaders = () => {
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const apiFetchFormData = async (endpoint: string, formData: FormData, method: 'POST' | 'PUT' = 'POST') => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: { ...getAuthHeaders() },
        body: formData,
    });
     if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};


// --- Auth ---
export const login = (identifier: string, password: string): Promise<{ user: User, token: string }> => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) });
// Fix: Added 'avatar' to the Omit list, as it's not required from the client during registration.
export const register = (userData: Omit<User, 'id' | 'avatar' | 'followers' | 'following' | 'stories' | 'highlights' | 'isVerified' | 'isPremium' | 'isPrivate' | 'notificationSettings' | 'mutedUsers' | 'blockedUsers'> & { password: string }): Promise<{ user: User, token: string }> => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
export const changePassword = (oldPassword: string, newPassword: string): Promise<{ message: string }> => apiFetch('/auth/change-password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) });


// --- Data Fetching ---
export const getFeed = (): Promise<{ posts: Post[] }> => apiFetch('/posts/feed');
export const getStories = (): Promise<{ stories: Story[] }> => apiFetch('/stories/feed');
export const getSuggestedUsers = (): Promise<{ users: User[] }> => apiFetch('/users/suggestions'); // This would be a real endpoint
export const getExplorePosts = (): Promise<{ posts: Post[] }> => apiFetch('/posts/explore');
export const getReels = (): Promise<{ reels: Reel[] }> => apiFetch('/reels');
export const getAllUsers = (): Promise<{ users: User[] }> => apiFetch('/users/all'); // For search/new message
export const getConversations = (): Promise<{ conversations: Conversation[] }> => apiFetch('/messages/conversations');
export const getMiscFeedData = (): Promise<{ feedActivities: FeedActivity[], trendingTopics: TrendingTopic[], sponsoredContent: SponsoredContent[] }> => apiFetch('/misc/feed-data');
export const getPremiumData = (): Promise<{ testimonials: Testimonial[] }> => apiFetch('/misc/premium-data');
export const getHelpArticles = (): Promise<{ articles: HelpArticle[] }> => apiFetch('/misc/help-articles');
export const getSupportTickets = (): Promise<{ tickets: SupportTicket[] }> => apiFetch('/misc/support-tickets');
export const getStickers = (): Promise<string[]> => apiFetch('/misc/stickers');
export const getSavedPosts = (): Promise<{ posts: Post[] }> => apiFetch('/users/saved-posts');
export const getArchivedPosts = (): Promise<{ posts: Post[] }> => apiFetch('/users/archived-posts');
export const getNotifications = (): Promise<{ notifications: Notification[] }> => apiFetch('/users/notifications');


// --- Actions ---
export const togglePostLike = (postId: string): Promise<{ liked: boolean }> => apiFetch(`/posts/${postId}/like`, { method: 'POST' });
export const togglePostSave = (postId: string): Promise<{ saved: boolean }> => apiFetch(`/posts/${postId}/save`, { method: 'POST' });
export const archivePost = (postId: string): Promise<{ success: boolean, isArchived: boolean }> => apiFetch(`/posts/${postId}/archive`, { method: 'POST' });
export const unarchivePost = (postId: string): Promise<{ success: boolean, isArchived: boolean }> => apiFetch(`/posts/${postId}/unarchive`, { method: 'POST' });
export const deletePost = (postId: string): Promise<{ success: boolean }> => apiFetch(`/posts/${postId}`, { method: 'DELETE' });
export const editPost = (postId: string, caption: string, location: string): Promise<Post> => apiFetch(`/posts/${postId}`, { method: 'PUT', body: JSON.stringify({ caption, location }) });
export const addComment = (postId: string, text: string): Promise<Comment> => apiFetch(`/posts/${postId}/comment`, { method: 'POST', body: JSON.stringify({ text }) });
export const followUser = (userId: string): Promise<{ success: boolean }> => apiFetch(`/users/${userId}/follow`, { method: 'POST' });
export const unfollowUser = (userId: string): Promise<{ success: boolean }> => apiFetch(`/users/${userId}/unfollow`, { method: 'POST' });
export const createPost = (formData: FormData): Promise<Post> => apiFetchFormData('/posts', formData);
export const createStory = (formData: FormData): Promise<Story> => apiFetchFormData('/stories', formData);
export const updateProfile = (formData: FormData): Promise<User> => apiFetchFormData('/users/profile', formData, 'PUT');
export const updateSettings = (settings: object): Promise<{ message: string }> => apiFetch('/users/settings', { method: 'PUT', body: JSON.stringify(settings) });
export const createHighlight = (title: string, storyIds: string[]): Promise<{ message: string }> => apiFetch('/users/highlights', { method: 'POST', body: JSON.stringify({ title, storyIds }) });

export const toggleReelLike = (reelId: string): Promise<{ liked: boolean }> => apiFetch(`/reels/${reelId}/like`, { method: 'POST' });
export const addReelComment = (reelId: string, text: string): Promise<Comment> => apiFetch(`/reels/${reelId}/comment`, { method: 'POST', body: JSON.stringify({ text }) });
export const toggleCommentLike = (commentId: string): Promise<{ liked: boolean }> => apiFetch(`/comments/${commentId}/like`, { method: 'POST' });

export const sendMessage = (recipientId: string, content: string, type: Message['type'], sharedContentId?: string): Promise<Message> => apiFetch('/messages', { method: 'POST', body: JSON.stringify({ recipientId, content, type, sharedContentId }) });

export const submitSupportTicket = (subject: string, description: string): Promise<{ message: string }> => apiFetch('/misc/support-tickets', { method: 'POST', body: JSON.stringify({ subject, description }) });
export const submitReport = (contentId: string, contentType: 'user' | 'post' | 'reel', reason: string): Promise<{ message: string }> => apiFetch('/misc/reports', { method: 'POST', body: JSON.stringify({ contentId, contentType, reason }) });


// --- AI Generation ---
export const generateCaption = (base64Data: string, mimeType: string): Promise<{ caption: string }> => apiFetch('/ai/generate-caption', { method: 'POST', body: JSON.stringify({ base64Data, mimeType }) });
export const generateStoryImage = (prompt: string): Promise<{ imageB64: string }> => apiFetch('/ai/generate-story-image', { method: 'POST', body: JSON.stringify({ prompt }) });
export const generateComment = (postCaption: string, style: string): Promise<{ comment: string }> => apiFetch('/ai/generate-comment', { method: 'POST', body: JSON.stringify({ postCaption, style }) });
export const generateBio = (username: string, name: string): Promise<{ bio: string }> => apiFetch('/ai/generate-bio', { method: 'POST', body: JSON.stringify({ username, name }) });