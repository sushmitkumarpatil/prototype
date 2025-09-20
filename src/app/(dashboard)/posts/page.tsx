'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NewPostDialog } from '@/components/new-content-dialogs';
import ApprovalStatusBadge from '@/components/approval-status-badge';
import { Plus, Search, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { getPosts, deletePost } from '@/lib/api/content';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2 } from 'lucide-react';
//

interface Post {
  id: number;
  title?: string;
  content: string;
  type: string;
  author?: {
    id: number;
    full_name: string;
    email: string;
    profile?: {
      profile_picture_url?: string;
    };
  };
  created_at: string;
  updated_at: string;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
  approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function PostsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      if (response.success && response.posts) {
        // Transform API posts to match local interface
        const transformedPosts = response.posts.map(post => ({
          ...post,
          type: 'post',
          likes_count: 0,
          comments_count: 0,
          is_liked: false
        }));
        setPosts(transformedPosts);
      } else {
        // Set empty array if no posts or response failed
        setPosts([]);
      }
    } catch (error: any) {
      console.error('Load posts error:', error);
      setPosts([]); // Set empty array on error
      
      // Don't show error toast for authentication errors - let the auth system handle it
      if (!error.message?.includes('Session expired') && !error.message?.includes('401')) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load posts',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return '??';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const getAuthorName = (author: any) => {
    if (!author) return 'Unknown User';
    return author.full_name || 'Unknown User';
  };

  const getAuthorProfilePicture = (author: any) => {
    if (!author || !author.profile) return undefined;
    return author.profile.profile_picture_url;
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await deletePost(postId);
      if (response.success) {
        setPosts(prev => prev.filter(post => post.id !== postId));
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
          variant: 'success',
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error: any) {
      console.error('Delete post error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const canEditPost = (post: Post) => {
    return user && post.author && (user.id === post.author.id || user.role === 'admin');
  };

  if (loading) {
    return (
      <>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">Community Posts</h1>
            <p className="text-muted-foreground">Share your thoughts and connect with fellow alumni.</p>
          </div>
          <NewPostDialog onCreated={(post) => {
            // Optimistically append for authors/admins; pending may be hidden in general feed
            setPosts((prev) => [{
              ...post,
              type: 'post',
              author: { id: post.author?.id ?? 0, name: post.author?.full_name ?? 'You', email: post.author?.email ?? '' },
              likes_count: 0,
              comments_count: 0,
              is_liked: false,
            } as any, ...prev]);
          }}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </NewPostDialog>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search posts..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to share something!'}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getAuthorProfilePicture(post.author)} alt={getAuthorName(post.author)} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                          {getInitials(getAuthorName(post.author))}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{getAuthorName(post.author)}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {post.type}
                          </Badge>
                          {post.approval_status && post.approval_status !== 'APPROVED' && (
                            <ApprovalStatusBadge status={post.approval_status} />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(post.created_at)}
                        </p>
                      </div>
                    </div>
                    {canEditPost(post) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {post.title && (
                    <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes_count}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments_count}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
