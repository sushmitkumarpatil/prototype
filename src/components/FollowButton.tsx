'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  sendFollowRequest,
  unfollowUser,
  getFollowStatus,
  type FollowStatus
} from '@/lib/api/follows';
import { getOrCreateConversation } from '@/lib/api/messaging';
import { UserPlus, UserMinus, Clock, MessageSquare, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: number;
  userName?: string;
  onFollowChange?: (status: FollowStatus) => void;
  showMessageButton?: boolean;
  onMessage?: () => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export function FollowButton({
  userId,
  userName = 'User',
  onFollowChange,
  showMessageButton = false,
  onMessage,
  size = 'default',
  variant = 'default'
}: FollowButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadFollowStatus();
  }, [userId]);

  const loadFollowStatus = async () => {
    try {
      setInitialLoading(true);
      const response = await getFollowStatus(userId);
      if (response?.success) {
        setFollowStatus(response.data);
        onFollowChange?.(response.data);
      }
    } catch (error: any) {
      console.error('Error loading follow status:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      setLoading(true);
      await sendFollowRequest(userId);
      toast({
        title: 'Follow Request Sent',
        description: `Your follow request has been sent to ${userName}.`,
      });
      // Refresh status
      await loadFollowStatus();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send follow request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setLoading(true);
      await unfollowUser(userId);
      toast({
        title: 'Unfollowed',
        description: `You have unfollowed ${userName}.`,
      });
      // Refresh status
      await loadFollowStatus();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to unfollow user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    if (onMessage) {
      onMessage();
      return;
    }

    // Default message behavior - create conversation and navigate
    try {
      setLoading(true);
      const response = await getOrCreateConversation(userId);
      if (response.success) {
        router.push('/messages');
        toast({
          title: 'Conversation Ready',
          description: `You can now message ${userName}.`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Cannot Start Conversation',
        description: error.message || 'You need to follow each other to send messages.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        Loading...
      </Button>
    );
  }

  if (!followStatus) {
    return null;
  }

  const getFollowButtonContent = () => {
    if (followStatus.isFollowing) {
      if (followStatus.followingStatus === 'PENDING') {
        return (
          <>
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </>
        );
      }
      // If following and can message, show message button instead of unfollow
      if (followStatus.canMessage) {
        return (
          <>
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </>
        );
      }
      return (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Unfollow
        </>
      );
    }
    return (
      <>
        <UserPlus className="h-4 w-4 mr-2" />
        Follow
      </>
    );
  };

  const getFollowButtonVariant = () => {
    if (followStatus.isFollowing) {
      if (followStatus.followingStatus === 'PENDING') return 'secondary';
      if (followStatus.canMessage) return 'default'; // Message button should be primary
      return 'outline'; // Unfollow button
    }
    return variant;
  };

  const getTooltipContent = () => {
    if (followStatus.isFollowing && followStatus.isFollowedBy) {
      return "You can message each other";
    }
    if (followStatus.isFollowing && !followStatus.isFollowedBy) {
      return "They need to follow you back to enable messaging";
    }
    if (!followStatus.isFollowing && followStatus.isFollowedBy) {
      return "Follow them back to enable messaging";
    }
    return "You need to follow each other to send messages";
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Button
          variant={getFollowButtonVariant()}
          size={size}
          onClick={
            followStatus.isFollowing && followStatus.canMessage
              ? handleMessage
              : followStatus.isFollowing
                ? handleUnfollow
                : handleFollow
          }
          disabled={loading || followStatus.followingStatus === 'PENDING'}
        >
          {getFollowButtonContent()}
        </Button>

        {showMessageButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={size}
                onClick={handleMessage}
                disabled={!followStatus.canMessage || loading}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipContent()}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Show mutual follow status */}
        {followStatus.isFollowing && !followStatus.canMessage && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {followStatus.isFollowedBy ? 'Mutual follow required' : 'Waiting for follow back'}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
