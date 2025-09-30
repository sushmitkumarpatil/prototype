'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Briefcase, 
  Calendar, 
  Users,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getApprovalStats,
  getPendingJobs,
  getPendingEvents,
  approveJob,
  rejectJob,
  approveEvent,
  rejectEvent,
  getAllUsers
} from '@/lib/api/admin';

interface ApprovalStats {
  pending_jobs: number;
  pending_events: number;
  pending_posts: number;
  pending_users: number;
}

interface PendingJob {
  id: number;
  title: string;
  company_name: string;
  location?: string;
  description: string;
  author: {
    id: number;
    full_name: string;
    is_verified: boolean;
  };
  created_at: string;
}

interface PendingEvent {
  id: number;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  author: {
    id: number;
    full_name: string;
    is_verified: boolean;
  };
  created_at: string;
}

interface PendingUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  account_status: string;
  created_at: string;
}

export function ApprovalManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadApprovalData();
  }, []);

  const loadApprovalData = async () => {
    try {
      setLoading(true);
      
      // Load approval stats
      const statsResponse = await getApprovalStats();
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      // Load pending jobs
      const jobsResponse = await getPendingJobs();
      if (jobsResponse.success) {
        setPendingJobs(jobsResponse.jobs);
      }

      // Load pending events
      const eventsResponse = await getPendingEvents();
      if (eventsResponse.success) {
        setPendingEvents(eventsResponse.events);
      }

      // Load pending users
      const usersResponse = await getAllUsers(1, 50, { status: 'PENDING' });
      if (usersResponse.success) {
        setPendingUsers(usersResponse.users.filter(user => user.account_status === 'PENDING'));
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load approval data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId: number, action: 'approve' | 'reject') => {
    const actionKey = `job-${jobId}-${action}`;
    try {
      setActionLoading(prev => ({ ...prev, [actionKey]: true }));
      
      if (action === 'approve') {
        await approveJob(jobId);
        toast({
          title: 'Success',
          description: 'Job approved successfully',
        });
      } else {
        await rejectJob(jobId);
        toast({
          title: 'Success',
          description: 'Job rejected successfully',
        });
      }
      
      // Remove from pending list
      setPendingJobs(prev => prev.filter(job => job.id !== jobId));
      
      // Update stats
      if (stats) {
        setStats(prev => prev ? { ...prev, pending_jobs: prev.pending_jobs - 1 } : null);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} job`,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleEventAction = async (eventId: number, action: 'approve' | 'reject') => {
    const actionKey = `event-${eventId}-${action}`;
    try {
      setActionLoading(prev => ({ ...prev, [actionKey]: true }));
      
      if (action === 'approve') {
        await approveEvent(eventId);
        toast({
          title: 'Success',
          description: 'Event approved successfully',
        });
      } else {
        await rejectEvent(eventId);
        toast({
          title: 'Success',
          description: 'Event rejected successfully',
        });
      }
      
      // Remove from pending list
      setPendingEvents(prev => prev.filter(event => event.id !== eventId));
      
      // Update stats
      if (stats) {
        setStats(prev => prev ? { ...prev, pending_events: prev.pending_events - 1 } : null);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} event`,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_jobs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_events || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.pending_jobs || 0) + (stats?.pending_events || 0) + pendingUsers.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="jobs">
              Jobs ({pendingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              Events ({pendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              Users ({pendingUsers.length})
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={loadApprovalData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <TabsContent value="jobs" className="space-y-4">
          {pendingJobs.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending jobs to review</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            pendingJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.company_name} • {job.location || 'Remote'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {job.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Posted by:</span> {job.author.full_name}
                        {job.author.is_verified && (
                          <Badge variant="secondary" className="ml-2">Verified</Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleJobAction(job.id, 'reject')}
                          disabled={actionLoading[`job-${job.id}-reject`]}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleJobAction(job.id, 'approve')}
                          disabled={actionLoading[`job-${job.id}-approve`]}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {pendingEvents.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending events to review</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            pendingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.start_time).toLocaleDateString()} • {event.location || 'Online'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Posted by:</span> {event.author.full_name}
                        {event.author.is_verified && (
                          <Badge variant="secondary" className="ml-2">Verified</Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEventAction(event.id, 'reject')}
                          disabled={actionLoading[`event-${event.id}-reject`]}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEventAction(event.id, 'approve')}
                          disabled={actionLoading[`event-${event.id}-approve`]}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {pendingUsers.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending users to review</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            pendingUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{user.full_name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Role:</span> {user.role}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
