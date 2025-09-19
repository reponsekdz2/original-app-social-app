// This file centralizes all API calls to the backend.

import type { User, Post, Reel, Story, Comment, Conversation, Notification, TrendingTopic, FeedActivity, SponsoredContent, Testimonial, HelpArticle, SupportTicket, Message, ConversationSettings, LiveStream, Report } from './types.ts';

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

export const forgotPassword = async (email: string): Promise<{ message: string, resetTokenForSimulation: string }> => {
  return apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
    return apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
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
export const getLiveStreams = async (): Promise<LiveStream[]> => apiRequest('/livestreams');


// --- User & Post Actions ---

const postWithAuth = (endpoint: string, body?: object) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) });
const putWithAuth = (endpoint: string, body: object) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) });
const deleteWithAuth = (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' });

export const toggleLike = (postId: string) => postWithAuth(`/posts/${postId}/like`);
export const toggleSave = (postId: string) => postWithAuth(`/posts/${postId}/save`);
export const addComment = (postId: string, text: string): Promise<Comment> => postWithAuth(`/posts/${postId}/comments`, { text });
export const followUser = (userId: string) => postWithAuth(`/users/${userId}/follow`);
export const unfollowUser = (userId: string) => deleteWithAuth(`/users/${userId}/unfollow`);
export const archivePost = (postId: string) => putWithAuth(`/posts/${postId}/archive`, {});
export const unarchivePost = (postId: string) => putWithAuth(`/posts/${postId}/unarchive`, {});
export const editPost = (postId: string, caption: string, location: string) => putWithAuth(`/posts/${postId}`, { caption, location });
export const deletePost = (postId: string) => deleteWithAuth(`/posts/${postId}`);
export const createHighlight = (title: string, storyIds: string[]) => postWithAuth('/users/highlights', { title, storyIds });
export const updateSettings = (settings: Partial<User>) => putWithAuth('/users/settings', settings);
export const applyForVerification = (applicationData: object) => postWithAuth('/users/verification', applicationData);
export const subscribePremium = () => postWithAuth('/misc/subscribe-premium');
export const updateUserRelationship = (userId: string, action: 'mute' | 'unmute' | 'block' | 'unblock') => postWithAuth(`/users/${userId}/relationship`, { action });
export const markNotificationsRead = () => postWithAuth('/users/notifications/read');
export const sendTip = (postId: string, amount: number) => postWithAuth(`/posts/${postId}/tip`, { amount });

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

// --- Messaging ---
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
    return postWithAuth('/messages/group', { name, userIds });
};

export const updateConversationSettings = (conversationId: string, settings: Partial<ConversationSettings>): Promise<{ message: string }> => {
    return putWithAuth(`/messages/${conversationId}/settings`, settings);
}

// --- Live Streaming ---
export const startLiveStream = (title: string): Promise<LiveStream> => postWithAuth('/livestreams/start', { title });
export const endLiveStream = (streamId: string): Promise<{ message: string }> => postWithAuth(`/livestreams/${streamId}/end`);

// --- Reels & Comments ---
export const likeReel = (reelId: string) => postWithAuth(`/reels/${reelId}/like`);
export const postReelComment = (reelId: string, text: string) => postWithAuth(`/reels/${reelId}/comments`, { text });
export const likeComment = (commentId: string) => postWithAuth(`/comments/${commentId}/like`);

// --- Support & Reports ---
export const createSupportTicket = (subject: string, description: string) => postWithAuth('/misc/support-tickets', { subject, description });
export const submitReport = (entityId: string, entityType: string, reason: string, details: string) => postWithAuth('/reports', { entityId, entityType, reason, details });

// --- ADMIN ---
export const getAdminStats = () => apiRequest('/admin/stats');
export const getAdminUsers = (query: string) => apiRequest(`/admin/users?q=${query}`);
export const getAdminContent = (type: 'posts' | 'reels') => apiRequest(`/admin/content?type=${type}`);
export const getAdminReports = () => apiRequest('/admin/reports');
export const getAdminUserGrowthData = () => apiRequest('/admin/analytics/user-growth');
export const getAdminContentTrendsData = () => apiRequest('/admin/analytics/content-trends');

export const updateAdminUser = (userId: string, updates: { is_admin?: boolean, is_verified?: boolean }) => putWithAuth(`/admin/users/${userId}`, updates);
export const deleteAdminUser = (userId: string) => deleteWithAuth(`/admin/users/${userId}`);
export const deleteAdminContent = (type: 'post' | 'reel', id: string) => deleteWithAuth(`/admin/content/${type}/${id}`);
export const updateAdminReportStatus = (reportId: number, status: Report['status']) => putWithAuth(`/admin/reports/${reportId}`, { status });