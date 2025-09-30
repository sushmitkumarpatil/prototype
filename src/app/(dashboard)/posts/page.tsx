'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NewPostDialog } from '@/components/new-content-dialogs';
import ApprovalStatusBadge from '@/components/approval-status-badge';
import { Plus, Search, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { getPosts, deletePost, likePost, unlikePost, Post } from '@/lib/api/content';
import { PostCommentsDialog } from '@/components/post-comments-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2 } from 'lucide-react';

export default function PostsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);

  useEffect(() => {
    loadPosts();

    // Listen for real-time updates
    const handleRefreshPosts = () => {
      loadPosts();
    };

    window.addEventListener('refreshPosts', handleRefreshPosts);

    return () => {
      window.removeEventListener('refreshPosts', handleRefreshPosts);
    };
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts(currentPage, postsPerPage);
      if (response.success && response.posts) {
        setPosts(response.posts);

        // Set pagination info
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotalPosts(response.pagination.total);
        } else {
          // Calculate pagination from response
          const total = response.total || transformedPosts.length;
          setTotalPosts(total);
          setTotalPages(Math.ceil(total / postsPerPage));
        }
      } else {
        // Set empty array if no posts or response failed
        setPosts([]);
        setTotalPages(1);
        setTotalPosts(0);
      }
    } catch (error: any) {
      console.error('Load posts error:', error);
      setPosts([]); // Set empty array on error
      setTotalPages(1);
      setTotalPosts(0);

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
    (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
    if (typeof author === 'string') return author;
    return author.full_name || author.name || 'Unknown User';
  };

  const getAuthorProfilePicture = (author: any) => {
    if (!author) return undefined;
    if (typeof author === 'string') return undefined;

    let profilePictureUrl = null;
    if (author.profile?.profile_picture_url) {
      profilePictureUrl = author.profile.profile_picture_url;
    } else if (author.profile_picture_url) {
      profilePictureUrl = author.profile_picture_url;
    }

    if (!profilePictureUrl) return undefined;

    // If it's already a full URL (external), return as is
    if (profilePictureUrl.startsWith('http://') || profilePictureUrl.startsWith('https://')) {
      return profilePictureUrl;
    }
    // If it's a relative path (upload), prepend the backend URL
    if (profilePictureUrl.startsWith('/uploads/')) {
      return `http://localhost:8000${profilePictureUrl}`;
    }
    return profilePictureUrl;
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

  const handleLikePost = async (postId: number, currentlyLiked: boolean) => {
    try {
      const response = currentlyLiked
        ? await unlikePost(postId)
        : await likePost(postId);

      if (response.success) {
        setPosts(prev => prev.map(post =>
          post.id === postId
            ? {
                ...post,
                like_count: response.like_count,
                liked_by_user: response.liked
              }
            : post
        ));
      }
    } catch (error: any) {
      console.error('Like post error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const handleCommentPost = (postId: number) => {
    setSelectedPostId(postId);
    setCommentsDialogOpen(true);
  };

  const handleCommentAdded = (postId: number, commentCount: number) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comment_count: commentCount }
        : post
    ));
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
            // Add the new post with default interaction values
            setPosts((prev) => [{
              ...post,
              like_count: 0,
              comment_count: 0,
              liked_by_user: false,
            }, ...prev]);
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
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center text-muted-foreground hover:text-primary ${post.liked_by_user ? 'text-red-500' : ''}`}
                        onClick={() => handleLikePost(post.id, post.liked_by_user)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.liked_by_user ? 'fill-current' : ''}`} />
                        <span>{post.like_count}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center text-muted-foreground hover:text-primary"
                        onClick={() => handleCommentPost(post.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.comment_count}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Comments Dialog */}
      <PostCommentsDialog
        postId={selectedPostId}
        open={commentsDialogOpen}
        onOpenChange={setCommentsDialogOpen}
        onCommentAdded={(commentCount) => {
          if (selectedPostId) {
            handleCommentAdded(selectedPostId, commentCount);
          }
        }}
      />

    </>
  );
}
