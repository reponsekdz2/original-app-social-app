import type { User, Post, Reel, Story, Conversation, Message, TrendingTopic, FeedActivity, SponsoredContent, Notification, Testimonial, HelpArticle, SupportTicket, StoryItem, Comment } from '../types.ts';

const API_BASE_URL = ''; // The backend is running in the same origin

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
  const response = await fetch(`/api/auth/login`, {
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
    const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const forgotPassword = async (identifier: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
    });
    return handleResponse(response);
};

export const resetPassword = async (identifier: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
    });
    return handleResponse(response);
}

// --- APP DATA ---
export const getAppData = async (userId: string): Promise<any> => {
    const response = await fetch(`/api/app-data/${userId}`);
    return handleResponse(response);
}


// --- AI ---
export const generateCaption = async (base64Data: string, mimeType: string): Promise<{ caption: string }> => {
    const response = await fetch(`/api/ai/generate-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType }),
    });
    return handleResponse(response);
}

export const generateStoryImage = async (prompt: string): Promise<{ imageB64: string }> => {
    const response = await fetch(`/api/ai/generate-story-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    return handleResponse(response);
}

export const generateComment = async (postCaption: string, style: string): Promise<{ comment: string }> => {
    const response = await fetch(`/api/ai/generate-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postCaption, style }),
    });
    return handleResponse(response);
}

export const generateBio = async (username: string, name: string): Promise<{ bio: string }> => {
     const response = await fetch(`/api/ai/generate-bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name }),
    });
    return handleResponse(response);
}

// --- DATA ---
export const getStickers = async (): Promise<string[]> => {
    const response = await fetch(`/api/stickers`);
    return handleResponse(response);
}

// --- POSTS ---
export const togglePostLike = async (postId: string, userId: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${postId}/toggle-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
}

export const togglePostSave = async (postId: string, userId: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${postId}/toggle-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
}

export const addComment = async (postId: string, userId: string, text: string, replyToId?: string): Promise<Comment> => {
    const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text, replyToId }),
    });
    return handleResponse(response);
}

export const toggleCommentLike = async (commentId: string, userId: string): Promise<Comment> => {
    const response = await fetch(`/api/comments/${commentId}/toggle-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
}

export const createPost = async (postData: any): Promise<Post> => {
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    return handleResponse(response);
}

export const editPost = async (postId: string, caption: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
    });
    return handleResponse(response);
}

export const deletePost = async (postId: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}

export const archivePost = async (postId: string, userId: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${postId}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
}

export const unarchivePost = async (postId: string, userId: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${postId}/unarchive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
}

// --- REELS ---
export const toggleReelLike = async (reelId: string, userId: string): Promise<Reel> => {
    const response = await fetch(`/api/reels/${reelId}/toggle-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
}

export const addReelComment = async (reelId: string, userId: string, text: string, replyToId?: string): Promise<Comment> => {
    const response = await fetch(`/api/reels/${reelId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text, replyToId }),
    });
    return handleResponse(response);
}

// --- USERS ---
export const followUser = async (currentUserId: string, targetUserId: string): Promise<User> => {
    const response = await fetch(`/api/users/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId, targetUserId }),
    });
    return handleResponse(response);
}

export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<User> => {
    const response = await fetch(`/api/users/unfollow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId, targetUserId }),
    });
    return handleResponse(response);
}

export const updateUserSettings = async (userId: string, settings: Partial<User['notificationSettings'] & { isPrivate: boolean }>): Promise<User> => {
    const response = await fetch(`/api/users/${userId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });
    return handleResponse(response);
}

export const updateUserRelationship = async (currentUserId: string, targetUserId: string, action: 'mute' | 'unmute' | 'block' | 'unblock'): Promise<User> => {
    const response = await fetch(`/api/users/relationship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId, targetUserId, action }),
    });
    return handleResponse(response);
}


// --- MESSAGES ---
export const sendMessage = async (conversationId: string, senderId: string, content: string, type: Message['type'], replyToId?: string): Promise<Message> => {
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, content, type, replyToId }),
    });
    return handleResponse(response);
};

export const findOrCreateConversation = async (userId1: string, userId2: string): Promise<Conversation> => {
    const response = await fetch(`/api/conversations/find-or-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId1, userId2 }),
    });
    return handleResponse(response);
};


export const deleteMessage = async (conversationId: string, messageId: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/conversations/${conversationId}/messages/${messageId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};


// --- STORIES & HIGHLIGHTS ---
export const createStory = async (userId: string, storyItem: Omit<StoryItem, 'id'>): Promise<Story> => {
    const response = await fetch(`/api/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, storyItem }),
    });
    return handleResponse(response);
}

export const createHighlight = async (userId: string, title: string, storyIds: string[]): Promise<User> => {
    const response = await fetch(`/api/highlights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, storyIds }),
    });
    return handleResponse(response);
}

// --- SUPPORT ---
export const createSupportTicket = async (userId: string, subject: string, description: string): Promise<SupportTicket> => {
    const response = await fetch(`/api/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject, description }),
    });
    return handleResponse(response);
}

// --- MISC ---
export const reportContent = async (reporterId: string, contentId: string, contentType: 'post' | 'user' | 'reel', reason: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterId, contentId, contentType, reason }),
    });
    return handleResponse(response);
}
