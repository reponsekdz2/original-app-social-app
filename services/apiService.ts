
import type { User, Post, Reel, Story, Conversation, Message, Notification, FeedActivity, SponsoredContent, TrendingTopic, Testimonial, HelpArticle, SupportTicket, LiveStream, Report, AdminStats, AnalyticsData } from '../types.ts';

const API_BASE_URL = '/api';
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
    if (response.status === 401) {
       console.error('Authentication error. Logging out.');
       // Here you might want to trigger a logout action globally
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

const post = (endpoint: string, body: any) => fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse);
const get = (endpoint: string) => fetch(`${API_BASE_URL}${endpoint}`, { method: 'GET', headers: getHeaders() }).then(handleResponse);
const put = (endpoint: string, body: any) => fetch(`${API_BASE_URL}${endpoint}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse);
const del = (endpoint: string) => fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse);
const postFormData = (endpoint: string, formData: FormData) => {
    const headers = { ...getHeaders() };
    delete headers['Content-Type']; // Let the browser set the correct multipart/form-data header
    return fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', headers, body: formData }).then(handleResponse);
};


// --- AUTH ---
export const login = (identifier: string, password: string): Promise<{ user: User, token: string }> => post('/auth/login', { identifier, password });
export const register = (data: any): Promise<{ user: User, token: string }> => post('/auth/register', data);
export const getMe = (): Promise<{ user: User }> => get('/auth/me');
export const changePassword = (oldPassword: string, newPassword: string): Promise<void> => put('/auth/change-password', { oldPassword, newPassword });
export const forgotPassword = (email: string): Promise<void> => post('/auth/forgot-password', { email });
export const resetPassword = (token: string, password: string): Promise<void> => post('/auth/reset-password', { token, password });
export const enableTwoFactor = (): Promise<void> => post('/auth/enable-2fa', {});

// --- POSTS ---
export const getFeedPosts = (): Promise<{ posts: Post[] }> => get('/posts/feed');
export const getExplorePosts = (): Promise<{ posts: Post[] }> => get('/posts/explore');
export const createPost = (formData: FormData): Promise<Post> => postFormData('/posts', formData);
export const toggleLike = (postId: string): Promise<void> => post(`/posts/${postId}/like`, {});
export const toggleSave = (postId: string): Promise<void> => post(`/posts/${postId}/save`, {});
export const addComment = (postId: string, text: string): Promise<Comment> => post(`/posts/${postId}/comments`, { text });
export const editPost = (postId: string, caption: string, location: string): Promise<void> => put(`/posts/${postId}`, { caption, location });
export const deletePost = (postId: string): Promise<void> => del(`/posts/${postId}`);
export const archivePost = (postId: string): Promise<void> => put(`/posts/${postId}/archive`, {});
export const unarchivePost = (postId: string): Promise<void> => put(`/posts/${postId}/unarchive`, {});
export const sendTip = (postId: string, amount: number): Promise<void> => post(`/posts/${postId}/tip`, { amount });

// --- REELS ---
export const getReels = (): Promise<Reel[]> => get('/reels');
export const toggleReelLike = (reelId: string): Promise<void> => post(`/reels/${reelId}/like`, {});
export const addReelComment = (reelId: string, text: string): Promise<Comment> => post(`/reels/${reelId}/comments`, { text });

// --- STORIES & HIGHLIGHTS ---
export const getStories = (): Promise<{ stories: Story[] }> => get('/stories/feed');
export const createStory = (formData: FormData): Promise<void> => postFormData('/stories', formData);
export const createHighlight = (title: string, storyIds: string[]): Promise<void> => post('/users/highlights', { title, storyIds });

// --- MESSAGES ---
export const getConversations = (): Promise<Conversation[]> => get('/messages');
export const sendMessage = (recipientId: string, content: string | File, type: Message['type'], sharedContentId?: string, contentType?: 'post' | 'reel', conversationId?: string): Promise<Message> => {
    const formData = new FormData();
    if (typeof content === 'string') {
        formData.append('content', content);
    } else {
        formData.append('file', content);
    }
    formData.append('type', type);
    if (recipientId) formData.append('recipientId', recipientId);
    if (conversationId) formData.append('conversationId', conversationId);
    if (sharedContentId) formData.append('sharedContentId', sharedContentId);
    if (contentType) formData.append('contentType', contentType);
    
    return postFormData('/messages', formData);
};
export const createGroupChat = (name: string, userIds: string[]): Promise<Conversation> => post('/messages/group', { name, userIds });
export const updateConversationSettings = (conversationId: string, settings: any): Promise<void> => put(`/messages/${conversationId}/settings`, settings);

// --- USERS & PROFILE ---
export const getAllUsers = (): Promise<User[]> => get('/users');
export const followUser = (userId: string): Promise<void> => post(`/users/${userId}/follow`, {});
export const unfollowUser = (userId: string): Promise<void> => post(`/users/${userId}/unfollow`, {});
export const updateProfile = (data: any): Promise<User> => put('/users/profile', data);
export const updateUserSettings = (settings: any): Promise<void> => put('/users/settings', settings);

// --- MISC ---
export const getNotifications = (): Promise<Notification[]> => get('/misc/notifications');
export const getTrendingTopics = (): Promise<TrendingTopic[]> => get('/misc/trending');
export const getSuggestedUsers = (): Promise<User[]> => get('/misc/suggestions');
export const getFeedActivity = (): Promise<FeedActivity[]> => get('/misc/feed-activity');
export const getSponsoredContent = (): Promise<SponsoredContent[]> => get('/misc/sponsored');
export const getTestimonials = (): Promise<Testimonial[]> => get('/misc/testimonials');
export const getHelpArticles = (): Promise<HelpArticle[]> => get('/misc/help-articles');
export const getStickers = (): Promise<string[]> => Promise.resolve(['/stickers/1.webp', '/stickers/2.webp']); // Mocked as it's static
export const createSupportTicket = (subject: string, description: string): Promise<void> => post('/misc/support-tickets', { subject, description });
export const subscribeToPremium = (): Promise<void> => post('/misc/subscribe-premium', {});
export const applyForVerification = (data: any): Promise<void> => post('/misc/verification', data);

// --- LIVESTREAMS ---
export const getLiveStreams = (): Promise<LiveStream[]> => get('/livestreams');
export const startLiveStream = (title: string): Promise<LiveStream> => post('/livestreams/start', { title });

// --- ADMIN ---
export const getAdminStats = (): Promise<AdminStats> => get('/admin/stats');
export const getAdminUserGrowthData = (): Promise<AnalyticsData> => get('/admin/analytics/user-growth');
export const getAdminContentTrendsData = (): Promise<any> => get('/admin/analytics/content-trends');
export const getAdminUsers = (query: string): Promise<User[]> => get(`/admin/users?q=${query}`);
export const updateAdminUser = (userId: string, updates: any): Promise<void> => put(`/admin/users/${userId}`, updates);
export const deleteAdminUser = (userId: string): Promise<void> => del(`/admin/users/${userId}`);
export const getAdminContent = (type: 'posts' | 'reels'): Promise<(Post & Reel)[]> => get(`/admin/content?type=${type}`);
export const deleteAdminContent = (type: 'post' | 'reel', id: string): Promise<void> => del(`/admin/content/${type}/${id}`);
export const getAdminReports = (): Promise<Report[]> => get('/admin/reports');
export const updateAdminReportStatus = (reportId: number, status: string): Promise<void> => put(`/admin/reports/${reportId}`, { status });
export const getAdminSupportTickets = (): Promise<SupportTicket[]> => get('/admin/support-tickets');
export const getAdminSupportTicketDetails = (ticketId: number): Promise<SupportTicket> => get(`/admin/support-tickets/${ticketId}`);
export const replyToSupportTicket = (ticketId: number, message: string): Promise<void> => post(`/admin/support-tickets/${ticketId}/reply`, { message });
export const getAdminSponsoredContent = (): Promise<SponsoredContent[]> => get('/admin/sponsored');
export const createAdminSponsoredContent = (data: Omit<SponsoredContent, 'id'>): Promise<SponsoredContent> => post('/admin/sponsored', data);
export const updateAdminSponsoredContent = (id: number, data: Partial<SponsoredContent>): Promise<void> => put(`/admin/sponsored/${id}`, data);
export const deleteAdminSponsoredContent = (id: number): Promise<void> => del(`/admin/sponsored/${id}`);
export const getAdminTrendingTopics = (): Promise<TrendingTopic[]> => get('/admin/trending');
export const createAdminTrendingTopic = (topic: string, post_count: number): Promise<TrendingTopic> => post('/admin/trending', { topic, post_count });
export const deleteAdminTrendingTopic = (id: number): Promise<void> => del(`/admin/trending/${id}`);
