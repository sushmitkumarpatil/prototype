'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  getConversations,
  getMessages,
  sendMessage as apiSendMessage,
  markMessagesAsRead,
  type Message,
  type Conversation
} from '@/lib/api/messaging';

// Use the Message and Conversation types from the API

interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (receiverId: number, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  refreshConversations: () => Promise<void>;
  loadConversationMessages: (conversationId: string) => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

interface MessagingProviderProps {
  children: ReactNode;
}

export function MessagingProvider({ children }: MessagingProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { socket, isConnected } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && isConnected && socket) {
      // Listen for incoming messages
      socket.on('receive_message', (message: Message) => {
        console.log('Received message via socket:', message);

        // Always add the message to the messages array for real-time updates
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });

        // Update conversations list
        refreshConversations();

        // Show toast notification if not in active conversation or if message is not from current user
        if (!activeConversation ||
            (message.senderId !== activeConversation.participantA_id &&
             message.senderId !== activeConversation.participantB_id) ||
            message.senderId !== user?.id) {
          toast({
            title: 'New Message',
            description: `Message from ${message.senderId}`,
          });
        }
      });

      socket.on('message_read', (data: { conversationId: string; messageId: string }) => {
        // Update message read status
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.messageId ? { ...msg, read: true } : msg
          )
        );
      });

      // Load initial conversations
      refreshConversations();

      return () => {
        socket.off('receive_message');
        socket.off('message_read');
      };
    }
  }, [isAuthenticated, isConnected, socket, activeConversation]);

  const refreshConversations = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (receiverId: number, content: string) => {
    if (!socket || !user) return;

    try {
      // Send through API first (which will also emit through socket)
      await apiSendMessage(receiverId, content);

      // Refresh conversations to update last message
      refreshConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const response = await getMessages(conversationId);
      if (response.success) {
        // Set the messages for this conversation, replacing any existing ones
        setMessages(response.items.reverse()); // Reverse to show oldest first
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (conversationId: number) => {
    try {
      await markMessagesAsRead(conversationId);

      // Update local state
      setMessages(prev =>
        prev.map(msg => ({ ...msg, isRead: true }))
      );

      // Refresh conversations to update unread count
      refreshConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const value = {
    conversations,
    activeConversation,
    messages,
    isLoading,
    sendMessage,
    markAsRead,
    setActiveConversation,
    refreshConversations,
    loadConversationMessages,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}
