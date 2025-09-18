
import type { User, Post, Reel, Story, Conversation, Message, TrendingTopic, FeedActivity, SponsoredContent, Notification, Testimonial, HelpArticle, SupportTicket, StoryItem } from '../types.ts';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// --- AUTH ---
export const login = async (identifier: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  return handleResponse(response);
};

type RegisterData = {
    email: string;
    name: string;
    username: string;
    password: string;
    phone: string;
    dob: string;
}
export const register = async (data: RegisterData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const forgotPassword = async (identifier: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
    });
    return handleResponse(response);
};

// --- AI ---
export const generateCaption = async (base64Data: string, mimeType: string): Promise<{ caption: string }> => {
    const response = await fetch(`${API_BASE_URL}/ai/generate-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType }),
    });
    return handleResponse(response);
}

export const generateStoryImage = async (prompt: string): Promise<{ imageB64: string }> => {
    const response = await fetch(`${API_BASE_URL}/ai/generate-story-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    return handleResponse(response);
}

export const generateComment = async (postCaption: string, style: string): Promise<{ comment: string }> => {
    const response = await fetch(`${API_BASE_URL}/ai/generate-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postCaption, style }),
    });
    return handleResponse(response);
}

export const generateBio = async (username: string, name: string): Promise<{ bio: string }> => {
     const response = await fetch(`${API_BASE_URL}/ai/generate-bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name }),
    });
    return handleResponse(response);
}

// --- DATA ---
export const getStickers = async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/stickers`);
    return handleResponse(response);
}

export const deleteMessage = async (conversationId: string, messageId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/${messageId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};
