import type { User, Post, Conversation } from '../types.ts';

const API_BASE_URL = 'http://localhost:3000/api';

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An API error occurred');
    }
    return response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// Auth
export const login = (identifier: string, password: string): Promise<User> => apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ identifier, password }),
});

export const register = (userData: Omit<User, 'id' | 'avatar' | 'isVerified' | 'isPremium' | 'isPrivate' | 'followers' | 'following' | 'notificationSettings' | 'mutedUsers' | 'blockedUsers'> & {password: string}): Promise<User> => apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});

export const forgotPassword = (identifier: string): Promise<{message: string}> => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
});


// AI Generation
export const generateCaption = (base64Data: string, mimeType: string): Promise<{ caption: string }> => apiRequest('/ai/generate-caption', {
  method: 'POST',
  body: JSON.stringify({ base64Data, mimeType }),
});

export const generateStoryImage = (prompt: string): Promise<{ imageB64: string }> => apiRequest('/ai/generate-story-image', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
});

export const generateComment = (postCaption: string, style: string): Promise<{ comment: string }> => apiRequest('/ai/generate-comment', {
    method: 'POST',
    body: JSON.stringify({ postCaption, style }),
});

export const generateBio = (username: string, name: string): Promise<{ bio: string }> => apiRequest('/ai/generate-bio', {
    method: 'POST',
    body: JSON.stringify({ username, name }),
});

// Mocked sticker fetch
export const getStickers = async (): Promise<string[]> => {
    // In a real app, this would be an API call.
    return Promise.resolve([
        '/stickers/sticker1.webp',
        '/stickers/sticker2.webp',
        '/stickers/sticker3.webp',
    ]);
};

// Messages
export const deleteMessage = (conversationId: string, messageId: string): Promise<{ success: boolean }> => apiRequest(`/conversations/${conversationId}/messages/${messageId}`, {
    method: 'DELETE',
});

// This is just a placeholder to show how it might be used. The backend doesn't have this implemented.
export const getConversations = (): Promise<Conversation[]> => apiRequest('/conversations');

// Other data fetching. In a real app, these would be separate endpoints.
// For this app, we'll assume a single data fetch endpoint for mock data.
export const getAppData = (userId: string): Promise<any> => apiRequest(`/app-data/${userId}`);

export const updateUser = (userId: string, userData: Partial<User>): Promise<User> => apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
});

export const followUser = (currentUserId: string, targetUserId: string): Promise<{ success: true }> => apiRequest('/users/follow', {
    method: 'POST',
    body: JSON.stringify({ currentUserId, targetUserId }),
});

export const unfollowUser = (currentUserId: string, targetUserId: string): Promise<{ success: true }> => apiRequest('/users/unfollow', {
    method: 'POST',
    body: JSON.stringify({ currentUserId, targetUserId }),
});

export const createPost = (postData: any): Promise<Post> => apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
});
