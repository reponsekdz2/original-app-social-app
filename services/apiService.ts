import type { User, Post, Story, Reel, Conversation, Message, AdminStats, AnalyticsData, Report, SupportTicket, SponsoredContent, TrendingTopic, AuthCarouselImage, Announcement, AccountStatusInfo } from '../types.ts';

const apiRequest = async (method: string, path: string, body?: any, isFormData = false) => {
    const options: RequestInit = {
        method,
        credentials: 'include', // Important for sessions
    };

    if (body) {
        if (isFormData) {
            options.body = body; // body is already a FormData object
        } else {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(body);
        }
    }
    
    // In a real dev environment, you might have a full URL like http://localhost:3001
    const baseUrl = '/api'; 

    try {
        const response = await fetch(`${baseUrl}${path}`, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `An unknown error occurred. Status: ${response.status}` }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        if (response.status === 204) {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error(`API request failed: ${method} ${path}`, error);
        throw error;
    }
};


// --- Auth ---
export const login = (username, password) => apiRequest('POST', '/auth/login', { username, password });
export const register = (username, email, password) => apiRequest('POST', '/auth/register', { username, email, password });
export const logout = () => apiRequest('POST', '/auth/logout');
export const checkSession = () => apiRequest('GET', '/auth/session');

// --- Data Fetching ---
export const getPosts = (): Promise<Post[]> => apiRequest('GET', '/posts/feed');
export const getStories = (): Promise<Story[]> => apiRequest('GET', '/stories');
export const getReels = (): Promise<Reel[]> => apiRequest('GET', '/reels');
export const getAllUsers = (): Promise<User[]> => apiRequest('GET', '/users');
export const getCarouselImages = (): Promise<AuthCarouselImage[]> => apiRequest('GET', '/misc/carousel');
export const getStickers = async (): Promise<string[]> => {
    // This isn't in the backend, so we mock it.
    return Promise.resolve([
        '/uploads/assets/stickers/sticker1.png',
        '/uploads/assets/stickers/sticker2.png',
        '/uploads/assets/stickers/sticker3.png',
    ]);
};
export const getBlockedUsers = (): Promise<User[]> => apiRequest('GET', '/users/blocked'); // Assuming this endpoint exists
export const getAccountStatus = (): Promise<AccountStatusInfo> => apiRequest('GET', '/users/account-status'); // Assuming this endpoint exists

// --- Interactions ---
export const togglePostLike = (postId: string) => apiRequest('POST', `/posts/${postId}/like`);
export const togglePostSave = (postId: string) => apiRequest('POST', `/posts/${postId}/save`);
export const addComment = (postId: string, text: string) => apiRequest('POST', '/comments', { postId, text });
export const followUser = (userId: string) => apiRequest('POST', `/users/${userId}/follow`);

// --- Content Creation ---
export const createPost = (formData: FormData) => apiRequest('POST', '/posts', formData, true);
export const createReel = (formData: FormData) => apiRequest('POST', '/reels', formData, true);
export const createStory = (formData: FormData) => apiRequest('POST', '/stories', formData, true);

// --- Messaging ---
export const getConversations = (): Promise<Conversation[]> => apiRequest('GET', '/messages/conversations');
export const sendMessage = (
    content: string | File, 
    type: Message['type'], 
    conversationId?: string, 
    recipientId?: string,
    sharedContentId?: string,
    sharedContentType?: 'post' | 'reel'
): Promise<Message> => {
    if (typeof content === 'string') {
        return apiRequest('POST', '/messages', { content, type, conversationId, recipientId, sharedContentId, sharedContentType });
    } else {
        const formData = new FormData();
        formData.append('media', content);
        formData.append('type', type);
        if (conversationId) formData.append('conversationId', conversationId);
        if (recipientId) formData.append('recipientId', recipientId);
        return apiRequest('POST', '/messages', formData, true);
    }
};
export const createGroupChat = (name: string, userIds: string[]): Promise<Conversation> => apiRequest('POST', '/messages/conversations/group', { name, userIds });
export const addMessageReaction = (messageId: string, emoji: string) => apiRequest('POST', `/messages/${messageId}/react`, { emoji }); // Assuming endpoint
export const updateConversationSettings = (conversationId: string, settings: Partial<Conversation['settings']>) => apiRequest('PUT', `/messages/conversations/${conversationId}/settings`, { settings }); // Assuming endpoint

// --- Admin ---
export const getAdminStats = (): Promise<AdminStats> => apiRequest('GET', '/admin/stats');
export const getAdminUserGrowthData = (): Promise<AnalyticsData> => apiRequest('GET', '/admin/analytics/user-growth'); // Assuming endpoint
export const getAdminContentTrendsData = (): Promise<any> => apiRequest('GET', '/admin/analytics/content-trends'); // Assuming endpoint
export const getAdminUsers = (searchTerm: string): Promise<User[]> => apiRequest('GET', `/admin/users?search=${searchTerm}`);
export const updateAdminUser = (userId: string, updates: any) => apiRequest('PUT', `/admin/users/${userId}`, updates);
export const issueUserWarning = (userId: string, reason: string) => apiRequest('POST', `/admin/users/${userId}/warn`, { reason }); // Assuming endpoint
export const deleteAdminUser = (userId: string) => apiRequest('DELETE', `/admin/users/${userId}`);

export const getAdminContent = (type: 'posts' | 'reels'): Promise<any[]> => apiRequest('GET', `/admin/content/${type}`); // Assuming endpoint
export const deleteAdminContent = (type: string, id: string) => apiRequest('DELETE', `/admin/content/${type}/${id}`); // Assuming endpoint

export const getAdminReports = (): Promise<Report[]> => apiRequest('GET', '/admin/reports');
export const updateAdminReportStatus = (reportId: number, status: Report['status']) => apiRequest('PUT', `/admin/reports/${reportId}`, { status });

export const getAdminSupportTickets = (): Promise<SupportTicket[]> => apiRequest('GET', '/admin/support'); // Assuming endpoint
export const getAdminSupportTicketDetails = (ticketId: number): Promise<SupportTicket> => apiRequest('GET', `/admin/support/${ticketId}`); // Assuming endpoint
export const replyToSupportTicket = (ticketId: number, message: string): Promise<void> => apiRequest('POST', `/admin/support/${ticketId}/reply`, { message }); // Assuming endpoint

export const getAdminSponsoredContent = (): Promise<SponsoredContent[]> => apiRequest('GET', '/admin/sponsored'); // Assuming endpoint
export const createAdminSponsoredContent = (adData: Omit<SponsoredContent, 'id'>) => apiRequest('POST', '/admin/sponsored', adData); // Assuming endpoint
export const updateAdminSponsoredContent = (adId: number, adData: Partial<SponsoredContent>) => apiRequest('PUT', `/admin/sponsored/${adId}`, adData); // Assuming endpoint
export const deleteAdminSponsoredContent = (adId: number) => apiRequest('DELETE', `/admin/sponsored/${adId}`); // Assuming endpoint

export const getAdminTrendingTopics = (): Promise<TrendingTopic[]> => apiRequest('GET', '/admin/trending'); // Assuming endpoint
export const createAdminTrendingTopic = (topic: string, post_count: number) => apiRequest('POST', '/admin/trending', { topic, post_count }); // Assuming endpoint
export const deleteAdminTrendingTopic = (id: number) => apiRequest('DELETE', `/admin/trending/${id}`); // Assuming endpoint

export const adminGetCarouselImages = (): Promise<AuthCarouselImage[]> => apiRequest('GET', '/admin/carousel');
export const adminAddCarouselImage = (formData: FormData) => apiRequest('POST', '/admin/carousel', formData, true);
export const adminDeleteCarouselImage = (id: number) => apiRequest('DELETE', `/admin/carousel/${id}`);

export const getAnnouncements = (): Promise<Announcement[]> => apiRequest('GET', '/admin/announcements'); // Assuming endpoint
export const createAnnouncement = (payload: any) => apiRequest('POST', '/admin/announcements', payload); // Assuming endpoint
export const updateAnnouncement = (id: number, payload: any) => apiRequest('PUT', `/admin/announcements/${id}`, payload); // Assuming endpoint
export const deleteAnnouncement = (id: number) => apiRequest('DELETE', `/admin/announcements/${id}`); // Assuming endpoint

export const getAppSettings = (): Promise<Record<string, any>> => apiRequest('GET', '/admin/settings'); // Assuming endpoint
export const updateAppSettings = (settings: Record<string, any>) => apiRequest('PUT', '/admin/settings', settings); // Assuming endpoint
