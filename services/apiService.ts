// A central place for all API calls

const API_BASE_URL = '/api'; // Using a relative URL for proxying

// Helper function for API requests
const request = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      return null;
    }
    return response.json();
};


// --- Auth ---
export const register = (username: string, email: string, password: string, name: string, phone: string, dob: string, gender: string, country: string, avatarUrl: string) => {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, name, phone, dob, gender, country, avatar_url: avatarUrl }),
    });
};

export const login = (username: string, password: string) => {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
};

export const logout = () => {
    return request('/auth/logout', { method: 'POST' });
};

export const checkSession = () => {
    return request('/auth/session');
};


// --- Users ---
export const getUserProfile = (username: string) => request(`/users/profile/${username}`);
export const getSuggestedUsers = () => request('/users/suggested');
export const getAllUsers = () => request('/users/all');
export const followUser = (userId: string) => request(`/users/${userId}/follow`, { method: 'POST' });
export const unfollowUser = (userId: string) => request(`/users/${userId}/unfollow`, { method: 'POST' });
export const updateUserProfile = (data: any) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) });

// --- Posts ---
export const getFeedPosts = (page = 1) => request(`/posts/feed?page=${page}`);
export const createPost = (formData: FormData) => fetch(`${API_BASE_URL}/posts`, { method: 'POST', body: formData }).then(res => res.json());
export const likePost = (postId: string) => request(`/posts/${postId}/like`, { method: 'POST' });
export const savePost = (postId: string) => request(`/posts/${postId}/save`, { method: 'POST' });
export const getSavedPosts = () => request('/posts/saved');
export const getArchivedPosts = () => request('/posts/archived');
export const archivePost = (postId: string) => request(`/posts/${postId}/archive`, { method: 'POST' });
export const unarchivePost = (postId: string) => request(`/posts/${postId}/unarchive`, { method: 'POST' });
export const deletePost = (postId: string) => request(`/posts/${postId}`, { method: 'DELETE' });
export const createComment = (postId: string, text: string) => request('/posts/comment', { method: 'POST', body: JSON.stringify({ postId, text }) });

// FIX: Add missing likeComment function
export const likeComment = (commentId: string) => {
    return request(`/comments/${commentId}/like`, { method: 'POST' });
};

// FIX: Add missing voteOnPoll function
export const voteOnPoll = (pollId: string, optionId: number) => request(`/posts/poll/vote`, { method: 'POST', body: JSON.stringify({ pollId, optionId }) });

// --- Reels ---
export const getReels = (page = 1) => request(`/reels?page=${page}`);
export const createReel = (formData: FormData) => fetch(`${API_BASE_URL}/reels`, { method: 'POST', body: formData }).then(res => res.json());
export const likeReel = (reelId: string) => request(`/reels/${reelId}/like`, { method: 'POST' });

// --- Stories ---
export const getStories = () => request('/stories');
export const createStory = (formData: FormData) => fetch(`${API_BASE_URL}/stories`, { method: 'POST', body: formData }).then(res => res.json());
export const getArchivedStories = () => request('/users/stories/archived');
export const createHighlight = (title: string, storyIds: string[]) => request('/users/highlights', { method: 'POST', body: JSON.stringify({ title, storyIds }) });

// --- Messaging ---
export const getConversations = () => request('/messages/conversations');
export const sendMessage = (content: string | File, type: string, conversationId?: string, recipientId?: string, contentId?: string, contentType?: string, replyToMessageId?: string) => {
    if (typeof content === 'string') {
        return request('/messages', { method: 'POST', body: JSON.stringify({ content, type, conversationId, recipientId, contentId, contentType, replyToMessageId }) });
    }
    const formData = new FormData();
    formData.append('attachment', content);
    formData.append('type', type);
    if (conversationId) formData.append('conversationId', conversationId);
    if (recipientId) formData.append('recipientId', recipientId);
    if (replyToMessageId) formData.append('replyToMessageId', replyToMessageId);
    return fetch(`${API_BASE_URL}/messages`, { method: 'POST', body: formData }).then(res => res.json());
};
export const reactToMessage = (messageId: string, emoji: string) => request(`/messages/${messageId}/react`, { method: 'POST', body: JSON.stringify({ emoji }) });
export const createGroupChat = (name: string, userIds: string[]) => request('/messages/group', { method: 'POST', body: JSON.stringify({ name, userIds }) });

// --- Search & Misc ---
export const search = (query: string) => request(`/search?q=${query}`);
export const getFeedActivity = () => request('/misc/activity');
export const getSponsoredContent = () => request('/misc/sponsored');
export const getCarouselImages = () => request('/misc/carousel');
export const getStickers = () => request('/misc/stickers');
// FIX: Add missing getActiveAnnouncement function
export const getActiveAnnouncement = () => request('/misc/announcements/active');

// --- Settings & Privacy ---
export const changePassword = (oldPassword: string, newPassword: string) => request('/users/password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) });
export const getBlockedUsers = () => request('/users/blocked');
export const getLoginActivity = () => request('/users/activity');
export const getAccountStatus = () => request('/misc/account-status');
export const updateUserRelationship = (targetUserId: string, action: 'block' | 'unblock' | 'mute' | 'unmute') => request('/users/relationship', { method: 'POST', body: JSON.stringify({ targetUserId, action }) });

// --- Help & Support ---
export const getSupportTickets = () => request('/support/tickets');
export const createSupportTicket = (subject: string, description: string) => request('/support/tickets', { method: 'POST', body: JSON.stringify({ subject, description }) });

// --- Notifications ---
export const getNotifications = () => request('/notifications');
export const markNotificationsAsRead = () => request('/notifications/read', { method: 'POST' });

// --- Admin Panel ---
export const getAdminStats = () => request('/admin/stats');
export const getAdminAllUsers = () => request('/admin/users');
export const warnUser = (userId: string, reason: string) => request(`/admin/users/${userId}/warn`, { method: 'POST', body: JSON.stringify({ reason }) });
export const deleteUser = (userId: string) => request(`/admin/users/${userId}`, { method: 'DELETE' });
export const getAdminAllPosts = () => request('/admin/posts');
export const adminDeletePost = (postId: string) => request(`/admin/posts/${postId}`, { method: 'DELETE' });
export const getAdminAllReels = () => request('/admin/reels');
export const adminDeleteReel = (reelId: string) => request(`/admin/reels/${reelId}`, { method: 'DELETE' });
export const getAdminAllReports = () => request('/admin/reports');
export const updateReportStatus = (reportId: number, status: string) => request(`/admin/reports/${reportId}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const getAdminAllTickets = () => request('/admin/support/tickets');
export const getTicketReplies = (ticketId: number) => request(`/admin/support/tickets/${ticketId}/replies`);
export const replyToTicket = (ticketId: number, message: string) => request(`/admin/support/tickets/${ticketId}/reply`, { method: 'POST', body: JSON.stringify({ message }) });
export const getAdminAllSponsoredContent = () => request('/admin/sponsored');
export const addSponsoredContent = (data: any) => request('/admin/sponsored', { method: 'POST', body: JSON.stringify(data) });
export const deleteSponsoredContent = (id: number) => request(`/admin/sponsored/${id}`, { method: 'DELETE' });
export const getAdminTrendingTopics = () => request('/admin/trending');
export const addTrendingTopic = (topic: string) => request('/admin/trending', { method: 'POST', body: JSON.stringify({ topic }) });
export const deleteTrendingTopic = (id: number) => request(`/admin/trending/${id}`, { method: 'DELETE' });
export const adminUploadCarouselImage = (formData: FormData) => fetch(`${API_BASE_URL}/admin/carousel`, { method: 'POST', body: formData }).then(res => res.json());
export const adminDeleteCarouselImage = (id: number) => request(`/admin/carousel/${id}`, { method: 'DELETE' });
export const getAdminAnnouncements = () => request('/admin/announcements');
export const addAnnouncement = (data: any) => request('/admin/announcements', { method: 'POST', body: JSON.stringify(data) });
export const updateAnnouncement = (id: number, data: any) => request(`/admin/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAnnouncement = (id: number) => request(`/admin/announcements/${id}`, { method: 'DELETE' });
export const getAppSettings = () => request('/admin/settings');
export const updateAppSettings = (settings: any) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) });
// FIX: Add missing admin analytics functions (mocked)
export const getAdminUserGrowthData = async () => {
    // Mock data
    return Promise.resolve({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [120, 150, 180, 220, 250, 300]
    });
};
export const getAdminContentTrendsData = async () => {
    // Mock data
    return Promise.resolve({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        postValues: [500, 550, 600, 620, 680, 750],
        reelValues: [200, 250, 350, 400, 500, 600]
    });
};


// --- Live Streams & Calls ---
export const getLiveStreams = () => request('/livestreams');
export const startLiveStream = (title: string) => request('/livestreams', { method: 'POST', body: JSON.stringify({ title }) });
export const endLiveStream = (id: string) => request(`/livestreams/${id}/end`, { method: 'PUT' });
export const logCall = (data: any) => request('/calls/log', { method: 'POST', body: JSON.stringify(data) });
export const getCallHistory = () => request('/calls/history');

// --- Tags ---
export const getPostsByTag = (tag: string) => request(`/tags/${tag}`);