// A service to centralize all API calls

const API_BASE_URL = 'http://localhost:3000/api';

const request = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      // Try to parse the error body
      const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) { // No Content
        return null;
    }
    return response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

// --- AUTH ---
export const login = (identifier: string, password: string) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
});

export const register = (userData: any) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
});

export const getMe = (userId: string) => request(`/auth/me/${userId}`);
export const logout = () => request('/auth/logout', { method: 'POST' });

// --- GET ---
export const getPosts = () => request('/posts');
export const getUsers = () => request('/users');
export const getStories = () => request('/stories');
export const getReels = () => request('/reels');
export const getConversations = () => request('/conversations');
export const getConversationById = (id: string) => request(`/conversations/${id}`);
export const getActivities = () => request('/activities');
export const getSupportTickets = () => request('/support-tickets');
export const getNotifications = (userId: string) => request(`/notifications/${userId}`);
export const searchUsers = (query: string) => request(`/search/users?q=${encodeURIComponent(query)}`);
export const searchPosts = (query: string) => request(`/search/posts?q=${encodeURIComponent(query)}`);

// Get data that was previously mocked
export const getFeedActivities = () => request('/feed/activities');
export const getTrendingTopics = () => request('/trends');
export const getSuggestedUsers = (userId: string) => request(`/users/suggestions/${userId}`);
export const getSponsoredContent = () => request('/sponsored-content');
export const getPremiumTestimonials = () => request('/premium/testimonials');
export const getHelpArticles = () => request('/help/articles');
// Fix: Add getStickers to fetch stickers from the backend.
export const getStickers = () => request('/stickers');


// --- POST ---
export const createPost = (postData: any) => request('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
});

export const togglePostLike = (postId: string, userId: string) => request(`/posts/${postId}/toggle-like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
});

export const togglePostSave = (postId: string, userId: string) => request(`/posts/${postId}/toggle-save`, {
    method: 'POST',
     body: JSON.stringify({ userId }),
});

export const addComment = (postId: string, userId: string, text: string) => request(`/posts/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ userId, text }),
});

export const toggleCommentLike = (commentId: string, userId: string) => request(`/comments/${commentId}/toggle-like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
});

export const followUser = (currentUserId: string, targetUserId: string) => request('/users/follow', {
    method: 'POST',
    body: JSON.stringify({ currentUserId, targetUserId }),
});

export const unfollowUser = (currentUserId: string, targetUserId: string) => request('/users/unfollow', {
    method: 'POST',
    body: JSON.stringify({ currentUserId, targetUserId }),
});

export const sendMessage = (conversationId: string, messageData: any) => request(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(messageData),
});

export const initiateCall = (callerId: string, receiverId: string, type: 'audio' | 'video') => request('/calls/initiate', {
    method: 'POST',
    body: JSON.stringify({ callerId, receiverId, type }),
});

export const toggleArchivePost = (postId: string) => request(`/posts/${postId}/archive`, {
    method: 'POST',
});

export const markNotificationsAsRead = (userId: string) => request(`/notifications/${userId}/mark-read`, {
    method: 'POST',
});

// Fix: Add updateUserRelationship to handle mute, block, etc.
export const updateUserRelationship = (currentUserId: string, targetUserId: string, action: 'mute' | 'unmute' | 'block' | 'unblock' | 'restrict' | 'unrestrict') => request('/users/relationship', {
    method: 'POST',
    body: JSON.stringify({ currentUserId, targetUserId, action }),
});


// --- PUT ---
export const updateUserProfile = (userId: string, userData: any) => request(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
});

export const updateUserSettings = (userId: string, settings: any) => request(`/users/${userId}/settings`, {
    method: 'PUT',
    body: JSON.stringify(settings),
});


export const updatePost = (postId: string, caption: string) => request(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({ caption }),
});


// --- DELETE ---
export const deletePost = (postId: string) => request(`/posts/${postId}`, {
    method: 'DELETE',
});

// Fix: Add deleteMessage function.
export const deleteMessage = (conversationId: string, messageId: string) => request(`/conversations/${conversationId}/messages/${messageId}`, {
    method: 'DELETE',
});