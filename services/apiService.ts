
import type { User, Post, Story, Reel, Conversation, Message, SupportTicket, AdminStats, AnalyticsData, Report, AuthCarouselImage, Announcement, SponsoredContent, TrendingTopic } from '../types.ts';
import { mockUser, mockPosts, mockStories, mockReels, mockSuggested, mockTrending, mockActivities, mockSponsored, mockConversations, mockAllUsers } from './mockData.ts';

// This is a mock API service. In a real application, these would be network requests.

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let db = {
    users: [...mockAllUsers],
    posts: [...mockPosts],
    stories: [...mockStories],
    reels: [...mockReels],
    conversations: [...mockConversations],
    trending: [...mockTrending],
    activities: [...mockActivities],
    sponsored: [...mockSponsored],
    carouselImages: [
        { id: 1, image_url: 'https://images.unsplash.com/photo-1528732263494-242a3536015c?q=80&w=800&auto=format&fit=crop', sort_order: 1 },
        { id: 2, image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop', sort_order: 2 }
    ],
    supportTickets: [],
    reports: [],
    announcements: [],
    settings: { maintenance_mode: 'false', disable_new_registrations: 'false', reels_enabled: 'true' },
    stickers: [
        '/uploads/assets/stickers/sticker1.png',
        '/uploads/assets/stickers/sticker2.png',
        '/uploads/assets/stickers/sticker3.png',
        '/uploads/assets/stickers/sticker4.png',
    ],
    accountStatus: { status: 'active', warnings: [] },
    blockedUsers: [],
};

// --- AUTH ---
export const login = async (identifier: string, password: string): Promise<{ user: User }> => {
    await delay(500);
    const user = db.users.find(u => (u.username === identifier || u.email === identifier));
    if (user && password) { // Mock: no password check
        return { user };
    }
    throw new Error("Invalid credentials");
};

export const register = async (data: any): Promise<{ user: User }> => {
    await delay(500);
    const newUser: User = {
        id: String(Date.now()),
        username: data.username,
        name: data.name,
        email: data.email,
        avatar: 'https://picsum.photos/id/1025/200/200',
        followers: [],
        following: [],
        posts: [],
        reels: [],
        stories: [],
        savedPosts: [],
        isVerified: false, isPrivate: false, isPremium: false, isAdmin: false,
        blockedUsers: [], mutedUsers: [],
        status: 'active',
    };
    db.users.push(newUser);
    return { user: newUser };
};

export const getAuthCarouselImages = async (): Promise<AuthCarouselImage[]> => {
    await delay(200);
    return db.carouselImages;
};

// --- DATA FETCHING ---
export const getPosts = async (): Promise<Post[]> => { await delay(300); return db.posts; };
export const getStories = async (): Promise<Story[]> => { await delay(200); return db.stories; };
export const getReels = async (): Promise<Reel[]> => { await delay(300); return db.reels; };
export const getConversations = async (): Promise<Conversation[]> => { await delay(400); return db.conversations; };
export const getStickers = async (): Promise<string[]> => { await delay(100); return db.stickers; };
export const getBlockedUsers = async (): Promise<User[]> => { await delay(200); return db.users.filter(u => db.blockedUsers.includes(u.id)); };
export const getAccountStatus = async (): Promise<any> => { await delay(200); return db.accountStatus; };

// --- ACTIONS ---
export const sendMessage = async (userId: string, content: string | File, type: Message['type'], contentId?: string, contentType?: 'post' | 'reel', conversationId?: string): Promise<Message> => {
    await delay(250);
    let convo = conversationId ? db.conversations.find(c => c.id === conversationId) : db.conversations.find(c => !c.isGroup && c.participants.some(p => p.id === userId));

    const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: mockUser.id,
        content: typeof content === 'string' ? content : 'File content',
        timestamp: new Date().toISOString(),
        type,
        read: false,
    };

    if (convo) {
        convo.messages.push(message);
    } else {
        const newConvo: Conversation = {
            id: `convo-${Date.now()}`,
            participants: [mockUser, db.users.find(u => u.id === userId)!],
            messages: [message],
            isGroup: false,
            settings: { theme: 'default', vanish_mode_enabled: false },
        };
        db.conversations.unshift(newConvo);
    }
    return message;
};

export const addMessageReaction = async (messageId: string, emoji: string): Promise<void> => {
    await delay(100);
    // Mock logic: find message and add reaction
    console.log(`Reacting with ${emoji} to message ${messageId}`);
};
export const updateConversationSettings = async (conversationId: string, settings: Partial<Conversation['settings']>): Promise<void> => {
    await delay(150);
    const convo = db.conversations.find(c => c.id === conversationId);
    if (convo) {
        convo.settings = { ...convo.settings, ...settings };
    }
};
export const createGroupChat = async (name: string, userIds: string[]): Promise<Conversation> => {
    await delay(400);
    const participants = db.users.filter(u => userIds.includes(u.id) || u.id === mockUser.id);
    const newGroup: Conversation = {
        id: `convo-${Date.now()}`,
        participants,
        name,
        messages: [],
        isGroup: true,
        settings: { theme: 'default', vanish_mode_enabled: false },
    };
    db.conversations.unshift(newGroup);
    return newGroup;
};


// --- ADMIN ---
export const getAdminStats = async (): Promise<AdminStats> => { await delay(200); return { totalUsers: 1234, newUsersToday: 45, totalPosts: 5678, totalReels: 1234, pendingReports: 12, liveStreams: 3 }; };
export const getAdminUserGrowthData = async (): Promise<AnalyticsData> => { await delay(200); return { labels: ['W1', 'W2', 'W3', 'W4'], values: [100, 150, 120, 200] }; };
export const getAdminContentTrendsData = async (): Promise<any> => { await delay(200); return { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], postValues: [50, 60, 80, 70, 90], reelValues: [30, 40, 50, 45, 60] }; };
export const getAdminUsers = async (searchTerm: string): Promise<User[]> => { await delay(300); return db.users.filter(u => u.username.includes(searchTerm)); };
export const updateAdminUser = async (userId: string, updates: any): Promise<void> => { await delay(200); console.log('Updating user', userId, updates); };
export const issueUserWarning = async (userId: string, reason: string): Promise<void> => { await delay(200); console.log(`Warning user ${userId} for ${reason}`); };
export const deleteAdminUser = async (userId: string): Promise<void> => { await delay(200); console.log('Deleting user', userId); };
export const getAdminContent = async (type: 'posts' | 'reels'): Promise<any[]> => { await delay(300); return type === 'posts' ? db.posts.map(p => ({ id: p.id, username: p.user.username, caption: p.caption, media_url: p.media[0]?.url })) : db.reels.map(r => ({ id: r.id, username: r.user.username, caption: r.caption, media_url: r.video })); };
export const deleteAdminContent = async (type: 'post' | 'reel', id: string): Promise<void> => { await delay(200); console.log(`Deleting ${type} ${id}`); };
export const getAdminReports = async (): Promise<Report[]> => { await delay(300); return db.reports; };
export const updateAdminReportStatus = async (reportId: number, status: Report['status']): Promise<void> => { await delay(200); console.log(`Updating report ${reportId} to ${status}`); };
export const getAdminSupportTickets = async (): Promise<SupportTicket[]> => { await delay(300); return db.supportTickets; };
export const getAdminSupportTicketDetails = async (ticketId: number): Promise<SupportTicket> => { await delay(200); return db.supportTickets.find(t => t.id === ticketId)!; };
export const replyToSupportTicket = async (ticketId: number, message: string): Promise<void> => { await delay(200); console.log(`Replying to ticket ${ticketId} with: ${message}`); };
export const getAdminSponsoredContent = async (): Promise<SponsoredContent[]> => { await delay(200); return db.sponsored; };
export const updateAdminSponsoredContent = async (id: number, data: any): Promise<void> => { await delay(200); console.log(`Updating ad ${id}`, data); };
export const createAdminSponsoredContent = async (data: any): Promise<void> => { await delay(200); console.log('Creating ad', data); };
export const deleteAdminSponsoredContent = async (id: number): Promise<void> => { await delay(200); console.log(`Deleting ad ${id}`); };
export const getAdminTrendingTopics = async (): Promise<TrendingTopic[]> => { await delay(200); return db.trending; };
export const createAdminTrendingTopic = async (topic: string, post_count: number): Promise<void> => { await delay(200); console.log(`Creating trend ${topic}`); };
export const deleteAdminTrendingTopic = async (id: number): Promise<void> => { await delay(200); console.log(`Deleting trend ${id}`); };
export const adminGetCarouselImages = async (): Promise<AuthCarouselImage[]> => { await delay(200); return db.carouselImages; };
export const adminAddCarouselImage = async (formData: FormData): Promise<void> => { await delay(300); console.log('Uploading carousel image'); };
export const adminDeleteCarouselImage = async (id: number): Promise<void> => { await delay(200); console.log(`Deleting carousel image ${id}`); };
export const getAnnouncements = async (): Promise<Announcement[]> => { await delay(200); return db.announcements; };
export const updateAnnouncement = async (id: number, data: any): Promise<void> => { await delay(200); console.log(`Updating announcement ${id}`, data); };
export const createAnnouncement = async (data: any): Promise<void> => { await delay(200); console.log('Creating announcement', data); };
export const deleteAnnouncement = async (id: number): Promise<void> => { await delay(200); console.log(`Deleting announcement ${id}`); };
export const getAppSettings = async (): Promise<any> => { await delay(200); return db.settings; };
export const updateAppSettings = async (settings: any): Promise<void> => { await delay(200); db.settings = { ...db.settings, ...settings }; };
