'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useAdminApprovalUpdates } from '@/hooks/useContentApprovalUpdates';
import api from "@/lib/axios";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

interface ApprovalStats {
  totalVerifiedUsers: number;
  totalNonVerifiedUsers: number;
  verifiedUsersWithPosts: number;
  nonVerifiedUsersWithPosts: number;
  pendingJobs: number;
  pendingEvents: number;
  approvedJobs: number;
  approvedEvents: number;
  rejectedJobs: number;
  rejectedEvents: number;
}

interface PendingJob {
  id: number;
  title: string;
  company_name: string;
  author: {
    id: number;
    full_name: string;
    is_verified: boolean;
  };
  created_at: string;
  location: string;
}

interface PendingEvent {
  id: number;
  title: string;
  author: {
    id: number;
    full_name: string;
    is_verified: boolean;
  };
  created_at: string;
  start_time: string;
  location: string;
}

export default function AdminApprovalsPage() {
  const [stats, setStats] = useState<ApprovalStats>({
    totalVerifiedUsers: 0,
    totalNonVerifiedUsers: 0,
    verifiedUsersWithPosts: 0,
    nonVerifiedUsersWithPosts: 0,
    pendingJobs: 0,
    pendingEvents: 0,
    approvedJobs: 0,
    approvedEvents: 0,
    rejectedJobs: 0,
    rejectedEvents: 0
  });
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Real-time updates for admin dashboard
  useAdminApprovalUpdates((update) => {
    const { contentType, contentId, status } = update;

    if (contentType === 'job') {
      setPendingJobs(prev => prev.filter(job => job.id !== contentId));
      setStats(prev => ({
        ...prev,
        pendingJobs: prev.pendingJobs - 1,
        ...(status === 'APPROVED'
          ? { approvedJobs: prev.approvedJobs + 1 }
          : { rejectedJobs: prev.rejectedJobs + 1 }
        )
      }));
    } else if (contentType === 'event') {
      setPendingEvents(prev => prev.filter(event => event.id !== contentId));
      setStats(prev => ({
        ...prev,
        pendingEvents: prev.pendingEvents - 1,
        ...(status === 'APPROVED'
          ? { approvedEvents: prev.approvedEvents + 1 }
          : { rejectedEvents: prev.rejectedEvents + 1 }
        )
      }));
    }

    // Show toast notification for admin
    toast({
      title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} ${status.toLowerCase()}`,
      description: `${contentType} has been ${status.toLowerCase()} successfully`,
      variant: status === 'APPROVED' ? 'default' : 'destructive',
    });
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsResponse, jobsResponse, eventsResponse] = await Promise.all([
        api.get('/admin/approvals/stats'),
        api.get('/admin/approvals/jobs/pending'),
        api.get('/admin/approvals/events/pending')
      ]);

      setStats(statsResponse.data);
      setPendingJobs(jobsResponse.data.jobs);
      setPendingEvents(eventsResponse.data.events);
    } catch (error) {
      console.error('Error fetching approval data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type: 'job' | 'event', id: number) => {
    setLoading(true);
    try {
      await api.patch(`/admin/approvals/${type}s/${id}/approve`);
      
      if (type === 'job') {
        setPendingJobs(prev => prev.filter(job => job.id !== id));
        setStats(prev => ({ ...prev, pendingJobs: prev.pendingJobs - 1, approvedJobs: prev.approvedJobs + 1 }));
      } else {
        setPendingEvents(prev => prev.filter(event => event.id !== id));
        setStats(prev => ({ ...prev, pendingEvents: prev.pendingEvents - 1, approvedEvents: prev.approvedEvents + 1 }));
      }
    } catch (error) {
      console.error('Error approving:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (type: 'job' | 'event', id: number) => {
    setLoading(true);
    try {
      await api.patch(`/admin/approvals/${type}s/${id}/reject`);
      
      if (type === 'job') {
        setPendingJobs(prev => prev.filter(job => job.id !== id));
        setStats(prev => ({ ...prev, pendingJobs: prev.pendingJobs - 1, rejectedJobs: prev.rejectedJobs + 1 }));
      } else {
        setPendingEvents(prev => prev.filter(event => event.id !== id));
        setStats(prev => ({ ...prev, pendingEvents: prev.pendingEvents - 1, rejectedEvents: prev.rejectedEvents + 1 }));
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Content Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage pending content submissions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-lg">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{stats.pendingJobs + stats.pendingEvents} pending</span>
        </div>
      </div>

      {/* Modern Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalVerifiedUsers}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {stats.verifiedUsersWithPosts} active posters
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unverified Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalNonVerifiedUsers}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  {stats.nonVerifiedUsersWithPosts} with content
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl group-hover:scale-110 transition-transform">
                <UserX className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingJobs}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Awaiting review
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Events</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingEvents}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  Awaiting review
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Pending Items Tabs */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <TabsTrigger
            value="jobs"
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg rounded-lg transition-all"
          >
            <Briefcase className="h-4 w-4" />
            Pending Jobs ({stats.pendingJobs})
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg rounded-lg transition-all"
          >
            <Calendar className="h-4 w-4" />
            Pending Events ({stats.pendingEvents})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white text-xl">Pending Job Approvals</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                      Review and approve or reject job postings from users
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  {pendingJobs.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingJobs.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400 font-medium">{job.company_name}</p>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Author:</span>
                              <span>{job.author.full_name}</span>
                              {job.author.is_verified ? (
                                <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Unverified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Location:</span>
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Posted:</span>
                              <span>{formatDate(job.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-6">
                          <Button
                            size="sm"
                            onClick={() => handleApprove('job', job.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject('job', job.id)}
                            disabled={loading}
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No pending jobs</h3>
                  <p className="text-sm">All job postings have been reviewed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white text-xl">Pending Event Approvals</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                      Review and approve or reject event postings from users
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                  {pendingEvents.length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingEvents.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingEvents.map((event) => (
                    <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400">Event</p>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Author:</span>
                              <span>{event.author.full_name}</span>
                              {event.author.is_verified ? (
                                <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Unverified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Start:</span>
                              <span>{formatDate(event.start_time)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Location:</span>
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Posted:</span>
                              <span>{formatDate(event.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-6">
                          <Button
                            size="sm"
                            onClick={() => handleApprove('event', event.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject('event', event.id)}
                            disabled={loading}
                            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No pending events</h3>
                  <p className="text-sm">All event postings have been reviewed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
