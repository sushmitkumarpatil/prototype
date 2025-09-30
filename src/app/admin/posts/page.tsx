'use client';

export const dynamic = 'force-dynamic';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Eye, Clock, User, MessageSquare, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAllPosts, approvePost, rejectPost } from "@/lib/api/admin";
import { motion } from "framer-motion";

interface Post {
    id: number;
    title?: string;
    content: string;
    image_url?: string;
    approval_status: string;
    author: {
        id: number;
        full_name: string;
        email: string;
        role: string;
    };
    tenant?: {
        name: string;
        subdomain: string;
    };
    created_at: string;
}

export default function AdminPostsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false,
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async (page: number = 1, search?: string) => {
        try {
            setLoading(true);
            const response = await getAllPosts(page, 20, search);

            if (response.success) {
                setPosts(response.posts);
                setPagination(response.pagination);
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load posts',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePost = async (postId: number) => {
        try {
            await approvePost(postId);
            toast({
                title: 'Success',
                description: 'Post approved successfully',
                variant: 'success',
            });
            loadPosts(pagination.page, searchTerm);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve post',
                variant: 'destructive',
            });
        }
    };

    const handleRejectPost = async (postId: number) => {
        try {
            await rejectPost(postId);
            toast({
                title: 'Success',
                description: 'Post rejected successfully',
                variant: 'success',
            });
            loadPosts(pagination.page, searchTerm);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reject post',
                variant: 'destructive',
            });
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        loadPosts(1, value);
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.author.full_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const totalPosts = pagination.total;
    const pendingPosts = posts.filter(post => post.approval_status === 'PENDING').length;
    const approvedPosts = posts.filter(post => post.approval_status === 'APPROVED').length;

    const getPostType = (post: Post) => {
        if (post.title) {
            return { type: 'Article', variant: 'default' as const };
        } else {
            return { type: 'Status', variant: 'secondary' as const };
        }
    };

    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Post Management</h1>
                <p className="text-muted-foreground">
                    Review and manage post submissions from users.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            All posts
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Posts</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedPosts}</div>
                        <p className="text-xs text-muted-foreground">
                            Already approved
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredPosts.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Matching search criteria
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Authors</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(posts.map(post => post.author.id)).size}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Unique authors
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Post Management */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Post Management
                            </CardTitle>
                            <CardDescription>
                                Review and manage all post submissions from users.
                            </CardDescription>
                        </div>
                        <Button onClick={() => loadPosts(pagination.page, searchTerm)} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search posts by title, content, author..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading posts...</span>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPosts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No posts found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPosts.map((post) => {
                                            const postType = getPostType(post);
                                            return (
                                                <TableRow key={post.id}>
                                                    <TableCell>
                                                        <div className="max-w-md">
                                                            {post.title && (
                                                                <div className="font-medium mb-1">{post.title}</div>
                                                            )}
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {truncateContent(post.content, 120)}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={postType.variant}>
                                                            {postType.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-medium">{post.author.full_name}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={post.approval_status === 'APPROVED' ? 'default' :
                                                                    post.approval_status === 'PENDING' ? 'secondary' : 'destructive'}
                                                            className={post.approval_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                      post.approval_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                      'bg-red-100 text-red-800'}
                                                        >
                                                            {post.approval_status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {post.approval_status === 'PENDING' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-success border-success hover:bg-success/10"
                                                                        onClick={() => handleApprovePost(post.id)}
                                                                    >
                                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-destructive border-destructive hover:bg-destructive/10"
                                                                        onClick={() => handleRejectPost(post.id)}
                                                                    >
                                                                        <XCircle className="h-4 w-4 mr-1" />
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
