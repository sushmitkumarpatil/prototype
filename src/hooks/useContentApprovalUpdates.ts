'use client';

import { useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ContentApprovalUpdate {
  contentType: 'job' | 'event' | 'post';
  contentId: number;
  status: 'APPROVED' | 'REJECTED';
  metadata?: {
    title?: string;
    company_name?: string;
    location?: string;
    start_time?: string;
    approvedBy?: number;
    rejectedBy?: number;
  };
  timestamp: string;
}

interface UseContentApprovalUpdatesOptions {
  onJobApproved?: (update: ContentApprovalUpdate) => void;
  onJobRejected?: (update: ContentApprovalUpdate) => void;
  onEventApproved?: (update: ContentApprovalUpdate) => void;
  onEventRejected?: (update: ContentApprovalUpdate) => void;
  onPostApproved?: (update: ContentApprovalUpdate) => void;
  onPostRejected?: (update: ContentApprovalUpdate) => void;
  showToasts?: boolean;
}

export function useContentApprovalUpdates(options: UseContentApprovalUpdatesOptions = {}) {
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    onJobApproved,
    onJobRejected,
    onEventApproved,
    onEventRejected,
    onPostApproved,
    onPostRejected,
    showToasts = true,
  } = options;

  const handleContentApprovalUpdate = useCallback((update: ContentApprovalUpdate) => {
    const { contentType, status, metadata } = update;
    
    // Show toast notification
    if (showToasts) {
      const isApproved = status === 'APPROVED';
      const contentName = contentType === 'job' ? 'Job' : contentType === 'event' ? 'Event' : 'Post';
      const title = metadata?.title || metadata?.company_name || 'Your content';
      
      toast({
        title: `${contentName} ${isApproved ? 'Approved' : 'Rejected'}`,
        description: isApproved 
          ? `Your ${contentType} "${title}" has been approved and is now live!`
          : `Your ${contentType} "${title}" was not approved. Please review and try again.`,
        variant: isApproved ? 'default' : 'destructive',
        duration: 6000,
      });
    }

    // Call specific handlers
    if (contentType === 'job') {
      if (status === 'APPROVED' && onJobApproved) {
        onJobApproved(update);
      } else if (status === 'REJECTED' && onJobRejected) {
        onJobRejected(update);
      }
    } else if (contentType === 'event') {
      if (status === 'APPROVED' && onEventApproved) {
        onEventApproved(update);
      } else if (status === 'REJECTED' && onEventRejected) {
        onEventRejected(update);
      }
    } else if (contentType === 'post') {
      if (status === 'APPROVED' && onPostApproved) {
        onPostApproved(update);
      } else if (status === 'REJECTED' && onPostRejected) {
        onPostRejected(update);
      }
    }
  }, [
    onJobApproved,
    onJobRejected,
    onEventApproved,
    onEventRejected,
    onPostApproved,
    onPostRejected,
    showToasts,
    toast,
  ]);

  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    // Listen for content approval updates
    socket.on('content_approval_update', handleContentApprovalUpdate);

    return () => {
      socket.off('content_approval_update', handleContentApprovalUpdate);
    };
  }, [socket, isConnected, user, handleContentApprovalUpdate]);

  return {
    isConnected,
  };
}

// Hook specifically for admin dashboard to listen for all approval updates
export function useAdminApprovalUpdates(
  onUpdate?: (update: ContentApprovalUpdate & { userId: number }) => void
) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const handleAdminApprovalUpdate = useCallback((update: ContentApprovalUpdate & { userId: number }) => {
    if (onUpdate) {
      onUpdate(update);
    }
  }, [onUpdate]);

  useEffect(() => {
    if (!socket || !isConnected || !user || !['TENANT_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return;
    }

    // Listen for admin approval updates (all approvals in tenant)
    socket.on('admin_approval_update', handleAdminApprovalUpdate);

    return () => {
      socket.off('admin_approval_update', handleAdminApprovalUpdate);
    };
  }, [socket, isConnected, user, handleAdminApprovalUpdate]);

  return {
    isConnected,
  };
}
