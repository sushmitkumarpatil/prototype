'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { posts, users } from "@/lib/mock-data";
import { FileText, Plus, Search, Edit, Trash2, Eye, Clock, User, MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { useState } from "react";

export default function AdminPostsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('all');
    const [filterDate, setFilterDate] = useState('all');

    const getAuthor = (authorId: number) => users.find((user) => user.id === authorId);

    const filteredPosts = posts.filter(post => {
        const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAuthor = filterAuthor === 'all' || post.authorId.toString() === filterAuthor;
        
        // Date filtering logic
        let matchesDate = true;
        if (filterDate !== 'all') {
            const postDate = new Date(post.postedAt);
            const now = new Date();
            const oneDay = 24 * 60 * 60 * 1000;
            const oneWeek = 7 * oneDay;
            const oneMonth = 30 * oneDay;
            
            if (filterDate === 'today') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                matchesDate = postDate >= today && postDate < tomorrow;
            } else if (filterDate === 'week') {
                matchesDate = now.getTime() - postDate.getTime() <= oneWeek;
            } else if (filterDate === 'month') {
                matchesDate = now.getTime() - postDate.getTime() <= oneMonth;
            }
        }
        
        return matchesSearch && matchesAuthor && matchesDate;
    });

    const totalPosts = posts.length;
    const todayPosts = posts.filter(post => {
        const postDate = new Date(post.postedAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return postDate >= today && postDate < tomorrow;
    }).length;
    const weekPosts = posts.filter(post => {
        const postDate = new Date(post.postedAt);
        const now = new Date();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        return now.getTime() - postDate.getTime() <= oneWeek;
    }).length;
    const monthPosts = posts.filter(post => {
        const postDate = new Date(post.postedAt);
        const now = new Date();
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        return now.getTime() - postDate.getTime() <= oneMonth;
    }).length;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const getPostType = (post: typeof posts[0]) => {
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
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                <p className="text-muted-foreground">
                    Manage posts, monitor engagement, and moderate community content.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPosts}</div>
                        <p className="text-xs text-muted-foreground">+15 since last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Posts</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayPosts}</div>
                        <p className="text-xs text-muted-foreground">New posts today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{weekPosts}</div>
                        <p className="text-xs text-muted-foreground">Posts this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthPosts}</div>
                        <p className="text-xs text-muted-foreground">Posts this month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Content Management</CardTitle>
                            <CardDescription>
                                Manage and monitor all posts and content in the system.
                            </CardDescription>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Post
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search posts by title or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={filterAuthor} onValueChange={setFilterAuthor}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Author" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Authors</SelectItem>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filterDate} onValueChange={setFilterDate}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Date Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Posts Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Posted</TableHead>
                                <TableHead>Engagement</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPosts.map((post) => {
                                const author = getAuthor(post.authorId);
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
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{author?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{formatDate(post.postedAt)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-3 w-3" />
                                                    <span>12</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    <span>5</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Share2 className="h-3 w-3" />
                                                    <span>3</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-8">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No posts found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search criteria or create a new post.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
