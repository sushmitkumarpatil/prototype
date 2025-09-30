'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, MessageSquare, ChevronDown, UserCheck } from 'lucide-react';
import { getMutualFriends } from '@/lib/api/follows';
import { getOrCreateConversation } from '@/lib/api/messaging';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface MutualFriend {
  id: number;
  full_name: string;
  email: string;
  profile?: {
    profile_picture_url?: string;
    course?: {
      course_name: string;
    };
    batch_year?: number;
    job_title?: string;
    company?: string;
  };
}

interface MutualFriendsDropdownProps {
  onStartConversation?: (userId: number, userName: string) => void;
  className?: string;
}

export function MutualFriendsDropdown({ onStartConversation, className }: MutualFriendsDropdownProps) {
  const [mutualFriends, setMutualFriends] = useState<MutualFriend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const loadMutualFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading mutual friends...');
      const response = await getMutualFriends(1, 50); // Get up to 50 mutual friends
      console.log('Mutual friends response:', response);

      if (response.success) {
        setMutualFriends(response.data);
        console.log('Mutual friends loaded:', response.data.length);
      } else {
        setError('Failed to load mutual friends');
        console.error('Failed to load mutual friends:', response);
      }
    } catch (err) {
      console.error('Error loading mutual friends:', err);
      setError('Failed to load mutual friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mutualFriends.length === 0) {
      loadMutualFriends();
    }
  }, [isOpen]);

  const handleStartConversation = async (friend: MutualFriend) => {
    try {
      if (onStartConversation) {
        onStartConversation(friend.id, friend.full_name);
      } else {
        // Create conversation and navigate to messages
        await getOrCreateConversation(friend.id);
        router.push('/messages');
        toast({
          title: 'Conversation Started',
          description: `You can now message ${friend.full_name}`,
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 hover:bg-muted/50 transition-colors ${className}`}
          aria-label={`Mutual friends ${mutualFriends.length > 0 ? `(${mutualFriends.length} available)` : ''}`}
        >
          <Users className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline">Mutual Friends</span>
          <span className="sm:hidden">Friends</span>
          {mutualFriends.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {mutualFriends.length}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Mutual Friends
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-2 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadMutualFriends}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : mutualFriends.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No mutual friends yet</p>
            <p className="text-xs mb-3">
              Follow people and have them follow you back to see mutual friends here
            </p>
            <div className="text-xs bg-muted/50 rounded-lg p-3 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">How to start messaging:</span>
              </div>
              <ol className="space-y-1 text-xs">
                <li>1. Use the "Mutual Friends" button above</li>
                <li>2. Or find someone on the Alumni page</li>
                <li>3. Send them a follow request</li>
                <li>4. Wait for them to follow you back</li>
                <li>5. Once you follow each other, you can message!</li>
              </ol>
            </div>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="p-1">
              {mutualFriends.map((friend) => (
                <DropdownMenuItem
                  key={friend.id}
                  className="p-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 transition-colors"
                  onClick={() => handleStartConversation(friend)}
                  role="button"
                  aria-label={`Start conversation with ${friend.full_name}`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage
                        src={friend.profile?.profile_picture_url}
                        alt={`${friend.full_name}'s profile picture`}
                      />
                      <AvatarFallback className="text-xs">{getInitials(friend.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{friend.full_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        {friend.profile?.job_title && (
                          <span className="truncate max-w-32">{friend.profile.job_title}</span>
                        )}
                        {friend.profile?.batch_year && (
                          <Badge variant="outline" className="text-xs">
                            {friend.profile.batch_year}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {mutualFriends.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <p className="text-xs text-muted-foreground text-center">
                Click on a friend to start messaging
              </p>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
