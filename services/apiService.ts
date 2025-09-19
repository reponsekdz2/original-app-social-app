// This file centralizes all API calls to the backend.

import type { User, Post, Reel, Story, Comment, Conversation, Notification, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, Message, ConversationSettings } from './types.ts';

const API_BASE_URL = '/api';

// --- Helper Functions ---

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
  if (response.status === 204) return; // No content
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse(response);
};

// --- Authentication ---

export const checkAuth = async (): Promise<{ user: User }> => {
    return apiRequest('/auth/me');
};


export const login = async (identifier: string, password: string): Promise<{ user: User, token: string }> => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
};

export const register = async (userData: any): Promise<{ user: User, token: string }> => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
  return apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  return apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
};

export const enableTwoFactor = async (): Promise<{ message: string }> => {
  return apiRequest('/auth/enable-2fa', { method: 'POST' });
};

// --- Data Fetching ---

export const getFeed = async (): Promise<{ posts: Post[] }> => apiRequest('/posts/feed');
export const getExplore = async (): Promise<{ posts: Post[] }> => apiRequest('/posts/explore');
export const getStories = async (): Promise<{ stories: Story[] }> => apiRequest('/stories/feed');
export const getReels = async (): Promise<Reel[]> => apiRequest('/reels');
export const getUserProfile = async (username: string): Promise<User> => apiRequest(`/users/profile/${username}`);
export const getAllUsers = async (): Promise<User[]> => apiRequest('/users');
export const getTrending = async (): Promise<TrendingTopic[]> => apiRequest('/misc/trending');
export const getSuggestions = async (): Promise<User[]> => apiRequest('/misc/suggestions');
export const getFeedActivities = async (): Promise<FeedActivity[]> => apiRequest('/misc/feed-activity');
export const getSponsoredContent = async (): Promise<SponsoredContent[]> => apiRequest('/misc/sponsored');
export const getTestimonials = async (): Promise<Testimonial[]> => apiRequest('/misc/testimonials');
export const getHelpArticles = async (): Promise<HelpArticle[]> => apiRequest('/misc/help-articles');
export const getSupportTickets = async (): Promise<SupportTicket[]> => apiRequest('/misc/support-tickets');
export const getStickers = async (): Promise<string[]> => apiRequest('/misc/stickers');
export const getConversations = async (): Promise<Conversation[]> => apiRequest('/messages');
export const getSavedPosts = async (): Promise<Post[]> => apiRequest('/users/posts/saved');
export const getArchivedPosts = async (): Promise<Post[]> => apiRequest('/users/posts/archived');
export const getNotifications = async (): Promise<Notification[]> => apiRequest('/users/notifications');


// --- User & Post Actions ---

const postWithAuth = (endpoint: string) => apiRequest(endpoint, { method: 'POST' });
const putWithAuth = (endpoint: string, body: object) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) });

export const toggleLike = (postId: string) => postWithAuth(`/posts/${postId}/like`);
export const toggleSave = (postId: string) => postWithAuth(`/posts/${postId}/save`);
export const addComment = (postId: string, text: string): Promise<Comment> => apiRequest(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
export const followUser = (userId: string) => postWithAuth(`/users/${userId}/follow`);
export const unfollowUser = (userId: string) => apiRequest(`/users/${userId}/unfollow`, { method: 'DELETE' });
export const archivePost = (postId: string) => putWithAuth(`/posts/${postId}/archive`, {});
export const unarchivePost = (postId: string) => putWithAuth(`/posts/${postId}/unarchive`, {});
export const createHighlight = (title: string, storyIds: string[]) => apiRequest('/users/highlights', { method: 'POST', body: JSON.stringify({ title, storyIds }) });
export const updateSettings = (settings: Partial<User>) => putWithAuth('/users/settings', settings);
export const applyForVerification = (applicationData: object) => apiRequest('/users/verification', { method: 'POST', body: JSON.stringify(applicationData) });
export const subscribePremium = () => postWithAuth('/misc/subscribe-premium');
export const updateUserRelationship = (userId: string, action: 'mute' | 'unmute' | 'block' | 'unblock') => apiRequest(`/users/${userId}/relationship`, { method: 'POST', body: JSON.stringify({ action }) });
export const markNotificationsRead = () => postWithAuth('/users/notifications/read');

// --- Actions with FormData ---

const postFormData = async (endpoint: string, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  return handleResponse(response);
};

const putFormData = async (endpoint: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData,
    });
    return handleResponse(response);
}

export const createPost = (formData: FormData) => postFormData('/posts', formData);
export const createStory = (formData: FormData) => postFormData('/stories', formData);
export const updateProfile = (formData: FormData) => putFormData('/users/profile', formData);


// --- AI Service ---
export const generateCaption = (base64Data: string, mimeType: string) => apiRequest('/ai/generate-caption', { method: 'POST', body: JSON.stringify({ base64Data, mimeType }) });
export const generateStoryImage = (prompt: string) => apiRequest('/ai/generate-story-image', { method: 'POST', body: JSON.stringify({ prompt }) });
export const generateComment = (postCaption: string, style: string) => apiRequest('/ai/generate-comment', { method: 'POST', body: JSON.stringify({ postCaption, style }) });
export const generateBio = (username: string, name: string) => apiRequest('/ai/generate-bio', { method: 'POST', body: JSON.stringify({ username, name }) });

// --- Messaging ---
// Fix: Update sendMessage to accept parameters and build FormData internally. This simplifies calls from components and resolves argument mismatch errors.
export const sendMessage = (
  recipientId: string,
  content: string | File,
  type: Message['type'],
  sharedContentId?: string,
  contentType?: 'post' | 'reel',
  conversationId?: string,
): Promise<Message> => {
    const formData = new FormData();
    if (conversationId) {
        formData.append('conversationId', conversationId);
    } else {
        formData.append('recipientId', recipientId);
    }
    
    if (typeof content === 'string') {
        formData.append('content', content);
    } else {
        formData.append('file', content);
    }

    formData.append('type', type);

    if (sharedContentId) {
        formData.append('sharedContentId', sharedContentId);
    }
    if (contentType) {
        formData.append('contentType', contentType);
    }

    return postFormData('/messages', formData);
};

export const createGroupChat = (name: string, userIds: string[]): Promise<Conversation> => {
    return apiRequest('/messages/group', {
        method: 'POST',
        body: JSON.stringify({ name, userIds })
    });
};

export const updateConversationSettings = (conversationId: string, settings: Partial<ConversationSettings>): Promise<{ message: string }> => {
    return apiRequest(`/messages/${conversationId}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings)
    });
}

// --- Reels & Comments ---
export const likeReel = (reelId: string) => postWithAuth(`/reels/${reelId}/like`);
export const postReelComment = (reelId: string, text: string) => apiRequest(`/reels/${reelId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
export const likeComment = (commentId: string) => postWithAuth(`/comments/${commentId}/like`);

// --- Support & Reports ---
export const createSupportTicket = (subject: string, description: string) => apiRequest('/misc/support-tickets', { method: 'POST', body: JSON.stringify({ subject, description }) });
export const submitReport = (entityId: string, entityType: string, reason: string, details: string) => apiRequest('/misc/reports', { method: 'POST', body: JSON.stringify({ entityId, entityType, reason, details }) });