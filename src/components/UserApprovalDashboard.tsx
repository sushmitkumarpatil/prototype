'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Briefcase, 
  Calendar, 
  FileText,
  RefreshCw,
  Eye,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useContentApprovalUpdates } from '@/hooks/useContentApprovalUpdates';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { formatDistanceToNow } from 'date-fns';

interface ContentItem {
  id: number;
  title: string;
  type: 'job' | 'event' | 'post';
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  approved_at?: string;
  company_name?: string;
  location?: string;
  start_time?: string;
}

interface UserApprovalDashboardProps {
  className?: string;
}

export function UserApprovalDashboard({ className }: UserApprovalDashboardProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Listen for real-time approval updates
  useContentApprovalUpdates({
    onJobApproved: (update) => {
      setContent(prev => prev.map(item => 
        item.type === 'job' && item.id === update.contentId
          ? { ...item, approval_status: 'APPROVED', approved_at: update.timestamp }
          : item
      ));
    },
    onJobRejected: (update) => {
      setContent(prev => prev.map(item => 
        item.type === 'job' && item.id === update.contentId
          ? { ...item, approval_status: 'REJECTED', approved_at: update.timestamp }
          : item
      ));
    },
    onEventApproved: (update) => {
      setContent(prev => prev.map(item => 
        item.type === 'event' && item.id === update.contentId
          ? { ...item, approval_status: 'APPROVED', approved_at: update.timestamp }
          : item
      ));
    },
    onEventRejected: (update) => {
      setContent(prev => prev.map(item => 
        item.type === 'event' && item.id === update.contentId
          ? { ...item, approval_status: 'REJECTED', approved_at: update.timestamp }
          : item
      ));
    },
    showToasts: true,
  });

  const fetchUserContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's jobs and events
      const [jobsResponse, eventsResponse] = await Promise.all([
        api.get('/api/jobs/my-jobs'),
        api.get('/api/events/my-events'),
      ]);

      const jobs = jobsResponse.data?.map((job: any) => ({
        ...job,
        type: 'job' as const,
      })) || [];

      const events = eventsResponse.data?.map((event: any) => ({
        ...event,
        type: 'event' as const,
      })) || [];

      // Combine and sort by creation date
      const allContent = [...jobs, ...events]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setContent(allContent);
    } catch (err) {
      console.error('Error fetching user content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Filter content by status
  const pendingContent = content.filter(item => item.approval_status === 'PENDING');
  const approvedContent = content.filter(item => item.approval_status === 'APPROVED');
  const rejectedContent = content.filter(item => item.approval_status === 'REJECTED');

  const renderContentList = (items: ContentItem[], emptyMessage: string) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="font-medium">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <ScrollArea className="max-h-64">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                {getTypeIcon(item.type)}
                {getStatusIcon(item.approval_status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{item.type}</span>
                  <span>•</span>
                  <span>
                    {item.approval_status === 'PENDING'
                      ? `Created ${formatDistanceToNow(new Date(item.created_at))} ago`
                      : `${item.approval_status.toLowerCase()} ${formatDistanceToNow(new Date(item.approved_at || item.created_at))} ago`
                    }
                  </span>
                </div>
                {item.company_name && (
                  <p className="text-xs text-muted-foreground">{item.company_name}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(item.approval_status)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            My Submissions
          </CardTitle>
          <CardDescription>Track your content approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            My Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchUserContent}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              My Submissions
            </CardTitle>
            <CardDescription>Track your content approval status</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUserContent}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {content.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No content submitted yet</p>
            <p className="text-sm">Create a job posting or event to see status updates here</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-lg font-bold text-yellow-700">{pendingContent.length}</span>
                </div>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-700">{approvedContent.length}</span>
                </div>
                <p className="text-xs text-green-600">Approved</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-lg font-bold text-red-700">{rejectedContent.length}</span>
                </div>
                <p className="text-xs text-red-600">Rejected</p>
              </div>
            </div>

            {/* Tabs for different statuses */}
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingContent.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approved ({approvedContent.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Rejected ({rejectedContent.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-4">
                {renderContentList(pendingContent, "No pending submissions")}
              </TabsContent>
              
              <TabsContent value="approved" className="mt-4">
                {renderContentList(approvedContent, "No approved submissions yet")}
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-4">
                {renderContentList(rejectedContent, "No rejected submissions")}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
