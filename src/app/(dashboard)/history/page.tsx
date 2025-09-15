'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, 
  Edit, 
  Eye, 
  Briefcase, 
  Calendar, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getJobs, getEvents, getPosts, deleteJob, deleteEvent, deletePost } from '@/lib/api/content';

interface UserSubmission {
  id: number;
  title: string;
  content?: string;
  description?: string;
  company?: string;
  location?: string;
  job_type?: string;
  salary?: string;
  event_date?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  status?: string;
  type: 'job' | 'event' | 'post';
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadUserSubmissions();
  }, []);

  const loadUserSubmissions = async () => {
    try {
      setLoading(true);
      
      // Load all user submissions
      const [jobsResponse, eventsResponse, postsResponse] = await Promise.all([
        getJobs(1, 100), // Get all jobs
        getEvents(1, 100), // Get all events  
        getPosts(1, 100) // Get all posts
      ]);

      const allSubmissions: UserSubmission[] = [];

      // Add jobs
      if (jobsResponse.success && jobsResponse.jobs) {
        const userJobs = jobsResponse.jobs
          .filter((job: any) => job.created_by === user?.id)
          .map((job: any) => ({
            ...job,
            type: 'job' as const,
            title: job.title,
            description: job.description,
          }));
        allSubmissions.push(...userJobs);
      }

      // Add events
      if (eventsResponse.success && eventsResponse.events) {
        const userEvents = eventsResponse.events
          .filter((event: any) => event.created_by === user?.id)
          .map((event: any) => ({
            ...event,
            type: 'event' as const,
            title: event.title,
            description: event.description,
          }));
        allSubmissions.push(...userEvents);
      }

      // Add posts
      if (postsResponse.success && postsResponse.posts) {
        const userPosts = postsResponse.posts
          .filter((post: any) => post.author.id === user?.id)
          .map((post: any) => ({
            ...post,
            type: 'post' as const,
            title: post.title || 'Untitled Post',
            content: post.content,
          }));
        allSubmissions.push(...userPosts);
      }

      // Sort by creation date (newest first)
      allSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setSubmissions(allSubmissions);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load your submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (submission: UserSubmission) => {
    if (!confirm(`Are you sure you want to delete this ${submission.type}?`)) {
      return;
    }

    try {
      let response;
      switch (submission.type) {
        case 'job':
          response = await deleteJob(submission.id);
          break;
        case 'event':
          response = await deleteEvent(submission.id);
          break;
        case 'post':
          response = await deletePost(submission.id);
          break;
        default:
          throw new Error('Invalid submission type');
      }

      if (response.success) {
        toast({
          title: 'Success',
          description: `${submission.type.charAt(0).toUpperCase() + submission.type.slice(1)} deleted successfully`,
          variant: 'success',
        });
        // Reload submissions
        loadUserSubmissions();
      } else {
        throw new Error(response.message || 'Failed to delete submission');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete submission',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'post':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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

  const filteredSubmissions = activeTab === 'all' 
    ? submissions 
    : submissions.filter(submission => submission.type === activeTab);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your submissions...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold mb-2">My Submissions</h1>
          <p className="text-muted-foreground">
            View and manage all your submitted jobs, events, and posts.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
            <TabsTrigger value="job">Jobs ({submissions.filter(s => s.type === 'job').length})</TabsTrigger>
            <TabsTrigger value="event">Events ({submissions.filter(s => s.type === 'event').length})</TabsTrigger>
            <TabsTrigger value="post">Posts ({submissions.filter(s => s.type === 'post').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    {activeTab === 'all' 
                      ? 'You haven\'t submitted anything yet.' 
                      : `You haven't submitted any ${activeTab}s yet.`
                    }
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={`${submission.type}-${submission.id}`} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(submission.type)}
                            <Badge variant="outline" className="capitalize">
                              {submission.type}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-semibold">{submission.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created {formatDate(submission.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {submission.status && (
                            <Badge className={getStatusColor(submission.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(submission.status)}
                                <span className="capitalize">{submission.status}</span>
                              </div>
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(submission)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {submission.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {submission.description}
                          </p>
                        )}
                        {submission.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {submission.content}
                          </p>
                        )}
                        {submission.company && (
                          <p className="text-sm">
                            <span className="font-medium">Company:</span> {submission.company}
                          </p>
                        )}
                        {submission.location && (
                          <p className="text-sm">
                            <span className="font-medium">Location:</span> {submission.location}
                          </p>
                        )}
                        {submission.job_type && (
                          <p className="text-sm">
                            <span className="font-medium">Type:</span> {submission.job_type}
                          </p>
                        )}
                        {submission.salary && (
                          <p className="text-sm">
                            <span className="font-medium">Salary:</span> {submission.salary}
                          </p>
                        )}
                        {submission.start_date && (
                          <p className="text-sm">
                            <span className="font-medium">Date:</span> {formatDate(submission.start_date)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
