'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: any[];
  joinRoom: (roomId: string, roomType: string) => void;
  leaveRoom: (roomId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('authToken'),
        },
        transports: ['websocket', 'polling'],
      });

      // Connection events
      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
        setIsConnected(true);
        
        // Join user's personal room
        socketInstance.emit('join_room', {
          roomId: `user:${user.id}`,
          roomType: 'user',
        });

        // Join tenant room
        socketInstance.emit('join_room', {
          roomId: `tenant:${user.tenant_id}`,
          roomType: 'tenant',
        });
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      // Real-time content updates
      socketInstance.on('post_created', (data) => {
        console.log('New post created:', data);
        // Trigger refresh of posts
        window.dispatchEvent(new CustomEvent('refreshPosts', { detail: data }));
      });

      socketInstance.on('job_posted', (data) => {
        console.log('New job posted:', data);
        // Trigger refresh of jobs
        window.dispatchEvent(new CustomEvent('refreshJobs', { detail: data }));
      });

      socketInstance.on('event_created', (data) => {
        console.log('New event created:', data);
        // Trigger refresh of events
        window.dispatchEvent(new CustomEvent('refreshEvents', { detail: data }));
      });

      // Event RSVP updates
      socketInstance.on('event_rsvp', (data) => {
        console.log('Event RSVP update:', data);
        // Trigger refresh of events to update RSVP counts
        window.dispatchEvent(new CustomEvent('refreshEvents', { detail: data }));
      });

      // Online users updates
      socketInstance.on('online_users_update', (users) => {
        setOnlineUsers(users);
      });

      // Notification events
      socketInstance.on('receive_notification', (notification) => {
        toast({
          title: notification.title,
          description: notification.message,
        });
        // Trigger notification refresh
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
      });

      // Follow events
      socketInstance.on('follow_request_received', (data) => {
        toast({
          title: 'New Follow Request',
          description: `${data.followerName} wants to follow you`,
        });
      });

      socketInstance.on('follow_accepted', (data) => {
        toast({
          title: 'Follow Request Accepted',
          description: `${data.followingName} accepted your follow request`,
        });
      });

      // Error handling
      socketInstance.on('error', (error) => {
        console.error('Socket error:', error);
        toast({
          title: 'Connection Error',
          description: 'There was an issue with the real-time connection',
          variant: 'destructive',
        });
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, user, toast]);

  const joinRoom = (roomId: string, roomType: string) => {
    if (socket) {
      socket.emit('join_room', { roomId, roomType });
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave_room', { roomId });
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
