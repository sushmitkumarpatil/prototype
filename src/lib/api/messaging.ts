import api from '../axios';

export interface Message {
  id: string;
  senderId: number;
  receiverId?: number;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  timestamp: string;
  isRead?: boolean;
  isDelivered?: boolean;
}

export interface Conversation {
  id: number;
  participantA_id: number;
  participantB_id: number;
  created_at: string;
  updated_at: string;
  participant?: {
    id: number;
    full_name: string;
    profile?: {
      profile_picture_url?: string;
    };
  };
  lastMessage?: Message;
  unreadCount: number;
}

export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MessagesResponse {
  success: boolean;
  items: Message[];
  nextCursor?: string;
}

// Get user's conversations
export const getConversations = async (page: number = 1, limit: number = 20) => {
  const response = await api.get(`/api/chat/conversations?page=${page}&limit=${limit}`);
  return response as ConversationsResponse;
};

// Get messages for a conversation
export const getMessages = async (conversationId: number, cursor?: string, take: number = 50) => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  params.append('take', take.toString());

  const response = await api.get(`/api/chat/conversations/${conversationId}/messages?${params.toString()}`);
  return response as MessagesResponse;
};

// Send a message
export const sendMessage = async (receiverId: number, content: string, messageType: string = 'TEXT') => {
  const response = await api.post('/api/chat/send', {
    receiverId,
    content,
    messageType
  });
  return response;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: number) => {
  const response = await api.post(`/api/chat/conversations/${conversationId}/read`);
  return response;
};

// Get conversation with a specific user
export const getOrCreateConversation = async (userId: number) => {
  const response = await api.post('/api/chat/conversations', {
    participantId: userId
  });
  return response;
};
