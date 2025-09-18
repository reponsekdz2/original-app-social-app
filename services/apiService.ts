// Fix: Add Story and Message to type imports to resolve missing type errors.
import type { User, Post, Conversation, Comment, StoryItem, Reel, Story, Message } from '../types.ts';

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

// --- Auth ---
export const login = (identifier: string, password: string): Promise<User> => apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ identifier, password }),
});

export const register = (userData: any): Promise<User> => apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});

export const forgotPassword = (identifier: string): Promise<{message: string}> => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
});

export const resetPassword = (identifier: string, password: string): Promise<{message: string}> => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
});


// --- AI Generation ---
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

// --- Data Fetching ---
export const getAppData = (userId: string): Promise<any> => apiRequest(`/app-data/${userId}`);

// --- User Actions ---
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

// --- Post Actions ---
export const createPost = (postData: any): Promise<Post> => apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
});

export const togglePostLike = (postId: string, userId: string): Promise<{success: boolean}> => apiRequest(`/posts/${postId}/toggle-like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
});

export const togglePostSave = (postId: string, userId: string): Promise<{success: boolean}> => apiRequest(`/posts/${postId}/toggle-save`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
});

export const addPostComment = (postId: string, userId: string, text: string, replyToId?: string): Promise<Comment> => apiRequest(`/posts/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ userId, text, replyToId }),
});

export const toggleCommentLike = (commentId: string, userId: string): Promise<{success: boolean}> => apiRequest(`/comments/${commentId}/toggle-like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
});

// --- Reel Actions ---
export const addReelComment = (reelId: string, userId: string, text: string, replyToId?: string): Promise<Comment> => apiRequest(`/reels/${reelId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ userId, text, replyToId }),
});


// --- Story Actions ---
export const createStory = (userId: string, storyItem: Omit<StoryItem, 'id'>): Promise<Story> => apiRequest(`/stories`, {
    method: 'POST',
    body: JSON.stringify({ userId, storyItem }),
});

// --- Message Actions ---
export const findOrCreateConversation = (userId1: string, userId2: string): Promise<Conversation> => apiRequest('/conversations/find-or-create', {
    method: 'POST',
    body: JSON.stringify({ userId1, userId2 }),
});

export const sendMessage = (convoId: string, messageData: any): Promise<Message> => apiRequest(`/conversations/${convoId}/messages`, {
    method: 'POST',
    body: JSON.stringify(messageData)
});

export const deleteMessage = (conversationId: string, messageId: string): Promise<{ success: boolean }> => apiRequest(`/conversations/${conversationId}/messages/${messageId}`, {
    method: 'DELETE',
});


// --- Misc ---
export const reportContent = (contentId: string, contentType: 'post' | 'user' | 'comment', reason: string, reportingUserId: string): Promise<{success: boolean}> => apiRequest('/report', {
    method: 'POST',
    body: JSON.stringify({ contentId, contentType, reason, reportingUserId }),
});

export const getStickers = async (): Promise<string[]> => Promise.resolve(['/stickers/sticker1.webp', '/stickers/sticker2.webp', '/stickers/sticker3.webp']);