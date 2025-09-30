'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import { getPostComments, addPostComment, Comment } from '@/lib/api/content';
import { useToast } from '@/hooks/use-toast';

interface PostCommentsDialogProps {
  postId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentAdded?: (commentCount: number) => void;
}

export function PostCommentsDialog({ 
  postId, 
  open, 
  onOpenChange, 
  onCommentAdded 
}: PostCommentsDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const { toast } = useToast();

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return undefined;
    // If it's already a full URL (external), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a relative path (upload), prepend the backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8000${imageUrl}`;
    }
    return imageUrl;
  };

  useEffect(() => {
    if (open && postId) {
      loadComments();
    }
  }, [open, postId]);

  const loadComments = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const response = await getPostComments(postId, 1, 20);
      if (response.success && response.data && response.data.comments && response.data.pagination) {
        setComments(response.data.comments);
        setPagination(response.data.pagination);
      } else {
        // Handle case where response structure is unexpected
        setComments([]);
        setPagination({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (error: any) {
      console.error('Load comments error:', error);
      // If the post doesn't exist (404), treat as no comments without toasting
      if (error?.status === 404) {
        setComments([]);
        setPagination({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      } else {
        // Reset to default state on other errors
        setComments([]);
        setPagination({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
        toast({
          title: 'Error',
          description: 'Failed to load comments',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!postId || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await addPostComment(postId, newComment.trim());
      if (response.success && response.data) {
        setComments(prev => [...prev, response.data.comment]);
        setPagination(prev => ({
          ...prev,
          total: response.data.comment_count
        }));
        setNewComment('');
        onCommentAdded?.(response.data.comment_count);
        toast({
          title: 'Success',
          description: 'Comment added successfully',
          variant: 'success',
        });
      }
    } catch (error: any) {
      if (error?.status === 404) {
        // Post no longer exists; inform user and close dialog
        toast({
          title: 'Post not found',
          description: 'This post may have been removed.',
          variant: 'default',
        });
        onOpenChange(false);
      } else {
        console.error('Add comment error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to add comment',
          variant: 'destructive',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            {pagination?.total || 0} {(pagination?.total || 0) === 1 ? 'comment' : 'comments'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Comments List */}
          <ScrollArea className="h-96 pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getImageUrl(comment.user.profile?.profile_picture_url)} />
                      <AvatarFallback className="text-xs">
                        {getInitials(comment.user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {comment.user.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
              disabled={submitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || submitting}
                size="sm"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Comment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
