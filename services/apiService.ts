import type { 
    User, Post, Reel, Story, Conversation, Message, Notification, 
    FeedActivity, SponsoredContent, TrendingTopic, Testimonial, 
    HelpArticle, SupportTicket, LiveStream, AdminStats, AnalyticsData, Report, Announcement, AuthCarouselImage, AccountStatusInfo 
} from '../types';

const API_URL = 'http://localhost:3001/api';

const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers: HeadersInit = {
        ...options.headers,
    };
    
    // Do not set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            credentials: 'include', // Automatically send session cookies
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        if (response.status === 204) { // No Content
            return undefined as T;
        }

        return response.json();
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
    }
};

// --- Auth ---
export const login = (identifier: string, password: string): Promise<{ user: User }> => 
    apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
    });

export const register = (data: any): Promise<{ user: User }> => 
    apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    
export const logout = (): Promise<void> => apiFetch('/auth/logout', { method: 'POST' });

export const getMe = (): Promise<{ user: User }> => apiFetch('/auth/me');

export const changePassword = (oldPassword: string, newPassword: string): Promise<void> =>
    apiFetch('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
    });
    
export const forgotPassword = (email: string): Promise<{ resetTokenForSimulation: string }> =>
    apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
    
export const resetPassword = (token: string, password: string): Promise<void> =>
    apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
    });

export const enableTwoFactor = (): Promise<void> => apiFetch('/auth/enable-2fa', { method: 'POST' });

// --- Content ---
export const getFeedPosts = (): Promise<{ posts: Post[] }> => apiFetch('/posts/feed');
export const getExplorePosts = (): Promise<{ posts: Post[] }> => apiFetch('/posts/explore');
export const getReels = (): Promise<Reel[]> => apiFetch('/reels');
export const getStories = (): Promise<{ stories: Story[] }> => apiFetch('/stories/feed');
export const createPost = (formData: FormData): Promise<Post> => apiFetch('/posts', { method: 'POST', body: formData });
export const createReel = (formData: FormData): Promise<Reel> => apiFetch('/reels', { method: 'POST', body: formData });
export const createStory = (formData: FormData): Promise<void> => apiFetch('/stories', { method: 'POST', body: formData });


// --- Interactions ---
export const toggleLike = (postId: string): Promise<void> => apiFetch(`/posts/${postId}/like`, { method: 'POST' });
export const toggleSave = (postId: string): Promise<void> => apiFetch(`/posts/${postId}/save`, { method: 'POST' });
export const addComment = (postId: string, text: string): Promise<Comment> => apiFetch(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
export const toggleCommentLike = (commentId: string): Promise<void> => apiFetch(`/comments/${commentId}/like`, { method: 'POST' });
export const toggleReelLike = (reelId: string): Promise<void> => apiFetch(`/reels/${reelId}/like`, { method: 'POST' });
export const addReelComment = (reelId: string, text: string): Promise<void> => apiFetch(`/reels/${reelId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
export const getNotifications = (): Promise<Notification[]> => apiFetch('/misc/notifications');
export const voteOnPoll = (optionId: number): Promise<void> => apiFetch(`/posts/polls/${optionId}/vote`, { method: 'POST' });
export const submitReport = (entityId: string, entityType: 'user' | 'post' | 'comment' | 'reel', reason: string, details: string): Promise<void> =>
    apiFetch('/reports', { method: 'POST', body: JSON.stringify({ entityId, entityType, reason, details }) });
export const acceptCollab = (postId: string): Promise<void> => apiFetch(`/posts/${postId}/collaborations/accept`, { method: 'POST' });
export const declineCollab = (postId: string): Promise<void> => apiFetch(`/posts/${postId}/collaborations/decline`, { method: 'POST' });


// --- Post Management ---
export const editPost = (postId: string, caption: string, location: string): Promise<void> => apiFetch(`/posts/${postId}`, { method: 'PUT', body: JSON.stringify({ caption, location }) });
export const deletePost = (postId: string): Promise<void> => apiFetch(`/posts/${postId}`, { method: 'DELETE' });
export const archivePost = (postId: string): Promise<void> => apiFetch(`/posts/${postId}/archive`, { method: 'PUT' });
export const unarchivePost = (postId: string): Promise<void> => apiFetch(`/posts/${postId}/unarchive`, { method: 'PUT' });

// --- Users ---
export const getAllUsers = (): Promise<User[]> => apiFetch('/users');
export const followUser = (userId: string): Promise<void> => apiFetch(`/users/${userId}/follow`, { method: 'POST' });
export const unfollowUser = (userId: string): Promise<void> => apiFetch(`/users/${userId}/unfollow`, { method: 'POST' });
export const blockUser = (userId: string): Promise<void> => apiFetch(`/users/${userId}/block`, { method: 'POST' });
export const unblockUser = (userId: string): Promise<void> => apiFetch(`/users/${userId}/unblock`, { method: 'POST' });
export const getBlockedUsers = (): Promise<User[]> => apiFetch('/users/blocked');
export const updateProfile = (data: any): Promise<void> => apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(data) });
export const updateUserSettings = (settings: any): Promise<void> => apiFetch('/users/settings', { method: 'PUT', body: JSON.stringify(settings) });
export const createHighlight = (title: string, storyIds: string[]): Promise<void> => apiFetch('/users/highlights', { method: 'POST', body: JSON.stringify({ title, storyIds }) });
export const muteUser = (userId: string): Promise<void> => apiFetch(`/users/${userId}/mute`, { method: 'POST' });
export const getAccountStatus = (): Promise<AccountStatusInfo> => apiFetch('/users/account-status');


// --- Messaging ---
export const getConversations = (): Promise<Conversation[]> => apiFetch('/messages');
export const sendMessage = (recipientId: string | undefined, content: string | File, type: Message['type'], sharedContentId?: string, contentType?: 'post' | 'reel', conversationId?: string): Promise<Message> => {
    const formData = new FormData();
    if (recipientId) formData.append('recipientId', recipientId);
    if (conversationId) formData.append('conversationId', conversationId);
    if (typeof content === 'string') {
        formData.append('content', content);
    } else {
        formData.append('file', content);
    }
    formData.append('type', type);
    if (sharedContentId) formData.append('sharedContentId', sharedContentId);
    if (contentType) formData.append('contentType', contentType);
    
    return apiFetch('/messages', { method: 'POST', body: formData });
};
export const createGroupChat = (name: string, userIds: string[]): Promise<Conversation> => apiFetch('/messages/group', { method: 'POST', body: JSON.stringify({ name, userIds }) });
export const updateConversationSettings = (conversationId: string, settings: Partial<Conversation['settings']>): Promise<void> => 
    apiFetch(`/messages/${conversationId}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings)
    });
export const addMessageReaction = (messageId: string, emoji: string): Promise<void> =>
    apiFetch(`/messages/${messageId}/react`, {
        method: 'POST',
        body: JSON.stringify({ emoji }),
    });


// --- Misc ---
export const getTrendingTopics = (): Promise<TrendingTopic[]> => apiFetch('/misc/trending');
export const getSuggestedUsers = (): Promise<User[]> => apiFetch('/misc/suggestions');
export const getFeedActivity = (): Promise<FeedActivity[]> => apiFetch('/misc/feed-activity');
export const getSponsoredContent = (): Promise<SponsoredContent[]> => apiFetch('/misc/sponsored');
export const getStickers = (): Promise<string[]> => apiFetch('/misc/stickers');
export const getActiveAnnouncement = (): Promise<Announcement | null> => apiFetch('/misc/announcements/active');
export const getAuthCarouselImages = (): Promise<AuthCarouselImage[]> => apiFetch('/misc/carousel-images');


// --- Premium & Support ---
export const subscribeToPremium = (): Promise<void> => apiFetch('/users/subscribe-premium', { method: 'POST' });
export const applyForVerification = (data: any): Promise<void> => apiFetch('/users/apply-verification', { method: 'POST', body: JSON.stringify(data) });
export const createSupportTicket = (subject: string, description: string): Promise<void> => apiFetch('/users/support-ticket', { method: 'POST', body: JSON.stringify({ subject, description }) });
export const sendTip = (postId: string, amount: number): Promise<void> => apiFetch(`/posts/${postId}/tip`, { method: 'POST', body: JSON.stringify({ amount }) });
export const startLiveStream = (title: string): Promise<LiveStream> => apiFetch('/livestreams/start', { method: 'POST', body: JSON.stringify({ title }) });
export const getLiveStreams = (): Promise<LiveStream[]> => apiFetch('/livestreams');

// --- Admin ---
export const getAdminStats = (): Promise<AdminStats> => apiFetch('/admin/stats');
export const getAdminUserGrowthData = (): Promise<AnalyticsData> => apiFetch('/admin/analytics/user-growth');
export const getAdminContentTrendsData = (): Promise<{ labels: string[], postValues: number[], reelValues: number[] }> => apiFetch('/admin/analytics/content-trends');
export const getAdminUsers = (searchTerm: string): Promise<User[]> => apiFetch(`/admin/users?search=${searchTerm}`);
export const updateAdminUser = (userId: string, updates: any): Promise<void> => apiFetch(`/admin/users/${userId}`, { method: 'PUT', body: JSON.stringify(updates) });
export const issueUserWarning = (userId: string, reason: string): Promise<void> => apiFetch(`/admin/users/${userId}/warn`, { method: 'POST', body: JSON.stringify({ reason }) });
export const deleteAdminUser = (userId: string): Promise<void> => apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
export const getAdminContent = (type: 'posts' | 'reels'): Promise<({ id: string, username: string, caption: string, media_url: string })[]> => apiFetch(`/admin/content?type=${type}`);
export const deleteAdminContent = (type: 'post' | 'reel', id: string): Promise<void> => apiFetch(`/admin/content/${type}/${id}`, { method: 'DELETE' });
export const getAdminReports = (): Promise<Report[]> => apiFetch('/admin/reports');
export const updateAdminReportStatus = (reportId: number, status: Report['status']): Promise<void> => apiFetch(`/admin/reports/${reportId}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const getAdminSupportTickets = (): Promise<SupportTicket[]> => apiFetch('/admin/support-tickets');
export const getAdminSupportTicketDetails = (ticketId: number): Promise<SupportTicket> => apiFetch(`/admin/support-tickets/${ticketId}`);
export const replyToSupportTicket = (ticketId: number, message: string): Promise<void> => apiFetch(`/admin/support-tickets/${ticketId}/reply`, { method: 'POST', body: JSON.stringify({ message }) });
export const getAdminSponsoredContent = (): Promise<SponsoredContent[]> => apiFetch('/admin/sponsored');
export const createAdminSponsoredContent = (data: any): Promise<void> => apiFetch('/admin/sponsored', { method: 'POST', body: JSON.stringify(data) });
export const updateAdminSponsoredContent = (id: number, data: any): Promise<void> => apiFetch(`/admin/sponsored/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAdminSponsoredContent = (id: number): Promise<void> => apiFetch(`/admin/sponsored/${id}`, { method: 'DELETE' });
export const getAdminTrendingTopics = (): Promise<TrendingTopic[]> => apiFetch('/admin/trending');
export const createAdminTrendingTopic = (topic: string, post_count: number): Promise<void> => apiFetch('/admin/trending', { method: 'POST', body: JSON.stringify({ topic, post_count }) });
export const deleteAdminTrendingTopic = (id: number): Promise<void> => apiFetch(`/admin/trending/${id}`, { method: 'DELETE' });
export const getAppSettings = (): Promise<Record<string, string>> => apiFetch('/admin/settings');
export const updateAppSettings = (settings: Record<string, string>): Promise<void> => apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) });
export const getAnnouncements = (): Promise<Announcement[]> => apiFetch('/admin/announcements');
export const createAnnouncement = (data: Partial<Announcement>): Promise<void> => apiFetch('/admin/announcements', { method: 'POST', body: JSON.stringify(data) });
export const updateAnnouncement = (id: number, data: Partial<Announcement>): Promise<void> => apiFetch(`/admin/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAnnouncement = (id: number): Promise<void> => apiFetch(`/admin/announcements/${id}`, { method: 'DELETE' });
export const adminGetCarouselImages = (): Promise<AuthCarouselImage[]> => apiFetch('/admin/carousel');
export const adminAddCarouselImage = (formData: FormData): Promise<void> => apiFetch('/admin/carousel', { method: 'POST', body: formData });
export const adminDeleteCarouselImage = (id: number): Promise<void> => apiFetch(`/admin/carousel/${id}`, { method: 'DELETE' });