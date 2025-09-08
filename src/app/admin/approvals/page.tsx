'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  UserCheck, 
  UserX, 
  Briefcase, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

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
    <div className="flex flex-col gap-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVerifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedUsersWithPosts} have posted content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Verified Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNonVerifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.nonVerifiedUsersWithPosts} have posted content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingJobs}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items Tabs */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Pending Jobs ({stats.pendingJobs})
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Pending Events ({stats.pendingEvents})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Job Approvals</CardTitle>
              <CardDescription>
                Review and approve or reject job postings from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {job.author.full_name}
                          {job.author.is_verified ? (
                            <Badge variant="secondary" className="text-xs">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{formatDate(job.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove('job', job.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject('job', job.id)}
                            disabled={loading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Event Approvals</CardTitle>
              <CardDescription>
                Review and approve or reject event postings from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {event.author.full_name}
                          {event.author.is_verified ? (
                            <Badge variant="secondary" className="text-xs">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(event.start_time)}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{formatDate(event.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove('event', event.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject('event', event.id)}
                            disabled={loading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
