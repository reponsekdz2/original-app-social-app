
// services/apiService.ts

import type {
  User,
  Post,
  Story,
  Reel,
  Conversation,
  Message,
  Notification,
  AdminStats,
  AnalyticsData,
  TrendingTopic,
  SponsoredContent,
  FeedActivity,
  AuthCarouselImage,
  SupportTicket,
  Report,
  Announcement,
  AccountStatusInfo,
  LiveStream,
  StoryItem,
  // Fix: Add Comment to type imports to avoid conflict with global DOM Comment type.
  Comment,
} from '../types.ts';

const API_BASE_URL = '/api';

async function fetchWrapper<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: HeadersInit = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

  return response.json();
}

// Auth
export const login = (username: string, password: string): Promise<{ user: User }> => fetchWrapper('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const register = (
    username: string, 
    email: string, 
    password: string,
    name: string,
    phone: string,
    dob: string,
    gender: string,
    country: string
): Promise<{ user: User }> => fetchWrapper('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password, name, phone, dob, gender, country }) });
export const logout = (): Promise<void> => fetchWrapper('/auth/logout', { method: 'POST' });
export const getSession = (): Promise<{ user: User }> => fetchWrapper('/auth/session');

// Posts
export const getPosts = (): Promise<Post[]> => fetchWrapper('/posts');
export const createPost = (formData: FormData): Promise<Post> => fetchWrapper('/posts', { method: 'POST', body: formData });
export const togglePostLike = (postId: string): Promise<{ likes: number }> => fetchWrapper(`/posts/${postId}/like`, { method: 'POST' });
export const togglePostSave = (postId: string): Promise<{ isSaved: boolean }> => fetchWrapper(`/posts/${postId}/save`, { method: 'POST' });
export const addPostComment = (postId: string, text: string): Promise<Comment> => fetchWrapper(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
export const getPostById = (postId: string): Promise<Post> => fetchWrapper(`/posts/${postId}`);
export const editPost = (postId: string, caption: string, location: string): Promise<Post> => fetchWrapper(`/posts/${postId}`, { method: 'PUT', body: JSON.stringify({ caption, location }) });
export const deletePost = (postId: string): Promise<void> => fetchWrapper(`/posts/${postId}`, { method: 'DELETE' });
export const archivePost = (postId: string): Promise<void> => fetchWrapper(`/posts/${postId}/archive`, { method: 'POST' });
export const unarchivePost = (postId: string): Promise<void> => fetchWrapper(`/posts/${postId}/unarchive`, { method: 'POST' });
export const sendTip = (postId: string, amount: number): Promise<void> => fetchWrapper(`/posts/${postId}/tip`, { method: 'POST', body: JSON.stringify({ amount }) });
export const voteOnPoll = (pollId: string, optionId: number): Promise<void> => fetchWrapper(`/posts/poll/${pollId}/vote`, { method: 'POST', body: JSON.stringify({ optionId }) });


// Reels
export const getReels = (): Promise<Reel[]> => fetchWrapper('/reels');
export const createReel = (formData: FormData): Promise<Reel> => fetchWrapper('/reels', { method: 'POST', body: formData });
export const toggleReelLike = (reelId: string): Promise<{ likes: number }> => fetchWrapper(`/reels/${reelId}/like`, { method: 'POST' });
export const addReelComment = (reelId: string, text: string): Promise<Comment> => fetchWrapper(`/reels/${reelId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });


// Stories
export const getStories = (): Promise<Story[]> => fetchWrapper('/stories');
export const createStory = (formData: FormData): Promise<{ message: string }> => fetchWrapper('/stories', { method: 'POST', body: formData });
export const getUserArchivedStories = (): Promise<StoryItem[]> => fetchWrapper('/users/me/stories/archived');
export const createHighlight = (title: string, storyIds: string[]): Promise<void> => fetchWrapper('/users/me/highlights', { method: 'POST', body: JSON.stringify({ title, storyIds }) });

// Users
export const getAllUsers = (): Promise<User[]> => fetchWrapper('/users');
export const getUserProfile = (username: string): Promise<User> => fetchWrapper(`/users/${username}`);
export const followUser = (userId: string): Promise<void> => fetchWrapper(`/users/${userId}/follow`, { method: 'POST' });
export const unfollowUser = (userId: string): Promise<void> => fetchWrapper(`/users/${userId}/unfollow`, { method: 'POST' });
export const updateProfile = (data: { name: string; bio: string; website: string; gender: string }): Promise<User> => fetchWrapper('/users/me', { method: 'PUT', body: JSON.stringify(data) });
export const getBlockedUsers = (): Promise<User[]> => fetchWrapper('/users/me/blocked');
export const blockUser = (userId: string): Promise<void> => fetchWrapper(`/users/${userId}/block`, { method: 'POST' });
export const unblockUser = (userId: string): Promise<void> => fetchWrapper(`/users/${userId}/unblock`, { method: 'POST' });
export const muteUser = (userId: string): Promise<void> => fetchWrapper(`/users/${userId}/mute`, { method: 'POST' });
export const unmuteUser = (userId: string): Promise<void> => fetchWrapper(`/users/${userId}/unmute`, { method: 'POST' });
export const getSuggestedUsers = (): Promise<User[]> => fetchWrapper('/users/suggestions');

// Messages
export const getConversations = (): Promise<Conversation[]> => fetchWrapper('/messages/conversations');
export const sendMessage = (content: string | File, type: Message['type'], conversationId?: string, recipientId?: string, sharedContentId?: string, sharedContentType?: 'post' | 'reel'): Promise<Message> => {
    const formData = new FormData();
    formData.append('type', type);
    if (conversationId) formData.append('conversationId', conversationId);
    if (recipientId) formData.append('recipientId', recipientId);
    if (sharedContentId) formData.append('sharedContentId', sharedContentId);
    if (sharedContentType) formData.append('sharedContentType', sharedContentType);

    if (typeof content === 'string') {
        formData.append('content', content);
    } else {
        formData.append('media', content);
    }

    return fetchWrapper('/messages', { method: 'POST', body: formData });
};
export const createGroupChat = (name: string, userIds: string[]): Promise<Conversation> => fetchWrapper('/messages/conversations/group', { method: 'POST', body: JSON.stringify({ name, userIds }) });
export const addMessageReaction = (messageId: string, emoji: string): Promise<void> => fetchWrapper(`/messages/${messageId}/react`, { method: 'POST', body: JSON.stringify({ emoji }) });
export const updateConversationSettings = (conversationId: string, settings: Partial<Conversation['settings']>): Promise<void> => fetchWrapper(`/messages/conversations/${conversationId}/settings`, { method: 'PUT', body: JSON.stringify(settings) });

// Notifications
export const getNotifications = (): Promise<Notification[]> => fetchWrapper('/notifications');

// Misc
export const getSponsoredContent = (): Promise<SponsoredContent[]> => fetchWrapper('/misc/sponsored');
export const getTrendingTopics = (): Promise<TrendingTopic[]> => fetchWrapper('/misc/trending');
export const getFeedActivity = (): Promise<FeedActivity[]> => fetchWrapper('/misc/feed-activity');
export const getStickers = (): Promise<string[]> => fetchWrapper('/misc/stickers');
export const getCarouselImages = (): Promise<AuthCarouselImage[]> => fetchWrapper('/misc/carousel');
export const getActiveAnnouncement = (): Promise<Announcement | null> => fetchWrapper('/misc/announcements/active');
export const getAccountStatus = (): Promise<AccountStatusInfo> => fetchWrapper('/misc/account-status');
export const getLiveStreams = (): Promise<LiveStream[]> => fetchWrapper('/livestreams');
export const startLiveStream = (title: string): Promise<LiveStream> => fetchWrapper('/livestreams', { method: 'POST', body: JSON.stringify({ title }) });
export const endLiveStream = (streamId: string): Promise<void> => fetchWrapper(`/livestreams/${streamId}/end`, { method: 'POST' });
export const submitReport = (content: Post | User, reason: string, details: string): Promise<void> => fetchWrapper('/reports', { method: 'POST', body: JSON.stringify({ content, reason, details }) });


// Admin
export const getAdminStats = (): Promise<AdminStats> => fetchWrapper('/admin/stats');
export const getAdminUserGrowthData = (): Promise<AnalyticsData> => fetchWrapper('/admin/analytics/user-growth');
export const getAdminContentTrendsData = (): Promise<any> => fetchWrapper('/admin/analytics/content-trends');
export const getAdminUsers = (searchTerm: string): Promise<User[]> => fetchWrapper(`/admin/users?search=${searchTerm}`);
export const updateAdminUser = (userId: string, updates: any): Promise<void> => fetchWrapper(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(updates) });
export const deleteAdminUser = (userId: string): Promise<void> => fetchWrapper(`/admin/users/${userId}`, { method: 'DELETE' });
export const issueUserWarning = (userId: string, reason: string): Promise<void> => fetchWrapper(`/admin/users/${userId}/warn`, { method: 'POST', body: JSON.stringify({ reason }) });
export const getAdminContent = (type: 'posts' | 'reels'): Promise<any[]> => fetchWrapper(`/admin/content?type=${type}`);
export const deleteAdminContent = (type: 'post' | 'reel', id: string): Promise<void> => fetchWrapper(`/admin/content/${type}/${id}`, { method: 'DELETE' });
export const getAdminReports = (): Promise<Report[]> => fetchWrapper('/admin/reports');
export const updateAdminReportStatus = (reportId: number, status: Report['status']): Promise<void> => fetchWrapper(`/admin/reports/${reportId}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const getAdminSupportTickets = (): Promise<SupportTicket[]> => fetchWrapper('/admin/support');
export const getAdminSupportTicketDetails = (ticketId: number): Promise<SupportTicket> => fetchWrapper(`/admin/support/${ticketId}`);
export const replyToSupportTicket = (ticketId: number, message: string): Promise<void> => fetchWrapper(`/admin/support/${ticketId}/reply`, { method: 'POST', body: JSON.stringify({ message }) });
export const getAdminSponsoredContent = (): Promise<SponsoredContent[]> => fetchWrapper('/admin/sponsored');
export const createAdminSponsoredContent = (ad: Omit<SponsoredContent, 'id'>): Promise<void> => fetchWrapper('/admin/sponsored', { method: 'POST', body: JSON.stringify(ad) });
export const updateAdminSponsoredContent = (id: number, ad: Partial<SponsoredContent>): Promise<void> => fetchWrapper(`/admin/sponsored/${id}`, { method: 'PUT', body: JSON.stringify(ad) });
export const deleteAdminSponsoredContent = (id: number): Promise<void> => fetchWrapper(`/admin/sponsored/${id}`, { method: 'DELETE' });
export const getAdminTrendingTopics = (): Promise<TrendingTopic[]> => fetchWrapper('/admin/trending');
export const createAdminTrendingTopic = (topic: string, post_count: number): Promise<void> => fetchWrapper('/admin/trending', { method: 'POST', body: JSON.stringify({ topic, post_count }) });
export const deleteAdminTrendingTopic = (id: number): Promise<void> => fetchWrapper(`/admin/trending/${id}`, { method: 'DELETE' });
export const adminGetCarouselImages = (): Promise<AuthCarouselImage[]> => fetchWrapper('/admin/carousel');
export const adminAddCarouselImage = (formData: FormData): Promise<void> => fetchWrapper('/admin/carousel', { method: 'POST', body: formData });
export const adminDeleteCarouselImage = (id: number): Promise<void> => fetchWrapper(`/admin/carousel/${id}`, { method: 'DELETE' });
export const getAnnouncements = (): Promise<Announcement[]> => fetchWrapper('/admin/announcements');
export const createAnnouncement = (announcement: Omit<Announcement, 'id'>): Promise<void> => fetchWrapper('/admin/announcements', { method: 'POST', body: JSON.stringify(announcement) });
export const updateAnnouncement = (id: number, announcement: Partial<Announcement>): Promise<void> => fetchWrapper(`/admin/announcements/${id}`, { method: 'PUT', body: JSON.stringify(announcement) });
export const deleteAnnouncement = (id: number): Promise<void> => fetchWrapper(`/admin/announcements/${id}`, { method: 'DELETE' });
export const getAppSettings = (): Promise<Record<string, any>> => fetchWrapper('/admin/settings');
export const updateAppSettings = (settings: Record<string, any>): Promise<void> => fetchWrapper('/admin/settings', { method: 'POST', body: JSON.stringify(settings) });