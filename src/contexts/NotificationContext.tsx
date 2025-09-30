'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  Notification
} from '@/lib/api/notifications';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotificationById: (notificationId: number) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();

  // Refresh notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications();
      refreshUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Socket event listeners for real-time notifications
  useEffect(() => {
    if (isAuthenticated && isConnected && socket) {
      // Listen for new notifications
      socket.on('receive_notification', (notification: Notification) => {
        setNotifications(prev => {
          // Check if notification already exists to prevent duplicates
          const exists = prev.some(n => n.id === notification.id);
          if (exists) {
            return prev;
          }
          return [notification, ...prev];
        });
        setUnreadCount(prev => prev + 1);

        // Show toast notification
        toast({
          title: notification.title,
          description: notification.message,
        });
      });

      // Listen for notification count updates
      socket.on('notification_count', (count: number) => {
        setUnreadCount(count);
      });

      return () => {
        socket.off('receive_notification');
        socket.off('notification_count');
      };
    }
  }, [isAuthenticated, isConnected, socket, toast]);

  const refreshNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await getNotifications(1, 20);
      if (response.success) {
        // Replace notifications completely with fresh data from API
        // This ensures we have the most up-to-date state from the server
        setNotifications(response.notifications);
      }
    } catch (error: any) {
      console.error('Refresh notifications error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await getUnreadNotificationCount();
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (error: any) {
      console.error('Refresh unread count error:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read_at: new Date().toISOString() }
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error('Mark notification as read error:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            read_at: notification.read_at || new Date().toISOString()
          }))
        );
        
        // Reset unread count
        setUnreadCount(0);
        
        toast({
          title: 'Success',
          description: 'All notifications marked as read',
        });
      }
    } catch (error: any) {
      console.error('Mark all notifications as read error:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const deleteNotificationById = async (notificationId: number) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.success) {
        // Update local state
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // Update unread count if the deleted notification was unread
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.read_at) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        toast({
          title: 'Success',
          description: 'Notification deleted',
        });
      }
    } catch (error: any) {
      console.error('Delete notification error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotificationById,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
