'use client';

export const dynamic = 'force-dynamic';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Search, CheckCircle, XCircle, Eye, Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getContentModeration, approveContent, type ContentModerationItem } from "@/lib/api/admin";
import { motion } from "framer-motion";

export default function AdminContentPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<ContentModerationItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const response = await getContentModeration(1, 100, {
                type: filterType !== 'all' ? filterType : undefined,
                status: filterStatus !== 'all' ? filterStatus : undefined,
            });

            if (response.success) {
                setContent(response.content);
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load content',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveContent = async (contentId: number, type: 'job' | 'event' | 'post') => {
        try {
            await approveContent(contentId, type, { action: 'APPROVE' });
            toast({
                title: 'Success',
                description: 'Content approved successfully',
                variant: 'success',
            });
            loadContent();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve content',
                variant: 'destructive',
            });
        }
    };

    const handleRejectContent = async (contentId: number, type: 'job' | 'event' | 'post') => {
        try {
            await approveContent(contentId, type, { action: 'REJECT' });
            toast({
                title: 'Success',
                description: 'Content rejected successfully',
                variant: 'success',
            });
            loadContent();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reject content',
                variant: 'destructive',
            });
        }
    };

    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.author.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        const matchesStatus = filterStatus === 'all' || item.approval_status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/15">Approved</Badge>;
            case 'REJECTED':
                return <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15">Rejected</Badge>;
            case 'PENDING':
                return <Badge className="bg-warning/10 text-warning-foreground border-warning/20 hover:bg-warning/15">Pending</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'job':
                return <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">Job</Badge>;
            case 'event':
                return <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/15">Event</Badge>;
            case 'post':
                return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted/80">Post</Badge>;
            default:
                return <Badge variant="secondary">{type}</Badge>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-card-foreground">
                                <AlertTriangle className="h-5 w-5 text-primary" />
                                Content Moderation
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">Review, approve, and manage all user-generated content.</CardDescription>
                        </div>
                        <Button onClick={loadContent} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by content, author..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="all">All Types</option>
                            <option value="job">Jobs</option>
                            <option value="event">Events</option>
                            <option value="post">Posts</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading content...</span>
                        </div>
                    ) : (
                        <div className="rounded-md border border-border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredContent.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No content found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredContent.map((item) => (
                                            <TableRow key={`${item.type}-${item.id}`}>
                                                <TableCell>
                                                    <div className="font-medium">{item.title}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                                        {item.content.substring(0, 100)}...
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getTypeBadge(item.type)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{item.author.full_name}</div>
                                                    <div className="text-sm text-muted-foreground">{item.author.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(item.approval_status)}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {item.approval_status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-success border-success hover:bg-success/10 hover:text-success"
                                                                    onClick={() => handleApproveContent(item.id, item.type)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                    onClick={() => handleRejectContent(item.id, item.type)}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
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
