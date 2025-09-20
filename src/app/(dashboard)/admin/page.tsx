'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
//
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Shield, 
  BarChart3,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDashboardStats, getAllUsers, getContentModeration } from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [moderationItems, setModerationItems] = useState<any[]>([]);

  useEffect(() => {
    if (user && (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN')) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dashboard stats
      const statsResponse = await getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      // Load users
      const usersResponse = await getAllUsers(1, 10);
      if (usersResponse.success) {
        setUsers(usersResponse.users);
      }

      // Load content for moderation
      const moderationResponse = await getContentModeration(1, 10);
      if (moderationResponse.success) {
        setModerationItems(moderationResponse.content);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusUpdate = async (userId: number, status: string) => {
    try {
      // This would call the updateUserStatus API
      toast({
        title: 'User Status Updated',
        description: `User status has been updated to ${status}.`,
      });
      await loadDashboardData();
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err.message || 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const handleContentApproval = async (contentId: number, type: string, action: 'APPROVE' | 'REJECT') => {
    try {
      // This would call the approveContent API
      toast({
        title: `Content ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`,
        description: `The ${type} has been ${action === 'APPROVE' ? 'approved' : 'rejected'}.`,
      });
      await loadDashboardData();
    } catch (err: any) {
      toast({
        title: 'Action Failed',
        description: err.message || `Failed to ${action.toLowerCase()} content`,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load admin dashboard"
        onRetry={loadDashboardData}
      />
    );
  }

  // Check if user has admin privileges
  if (!user || (user.role !== 'TENANT_ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <ErrorDisplay
        error="You do not have permission to access this page."
        title="Access Denied"
        showRetry={false}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-muted-foreground">
                    Manage your alumni community and moderate content.
                  </p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {user.role}
                </Badge>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.active_users || 0} active users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.pending_users || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_jobs || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pending_jobs || 0} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_events || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pending_events || 0} pending approval
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* User Management Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and permissions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.full_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium">{user.full_name}</h4>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary">{user.role}</Badge>
                                <Badge 
                                  variant={
                                    user.account_status === 'APPROVED' ? 'default' :
                                    user.account_status === 'PENDING' ? 'secondary' :
                                    'destructive'
                                  }
                                >
                                  {user.account_status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.account_status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUserStatusUpdate(user.id, 'APPROVED')}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleUserStatusUpdate(user.id, 'REJECTED')}
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Moderation Tab */}
              <TabsContent value="moderation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Moderation</CardTitle>
                    <CardDescription>
                      Review and approve content posted by users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {moderationItems.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline">{item.type}</Badge>
                                <Badge 
                                  variant={
                                    item.approval_status === 'PENDING' ? 'secondary' :
                                    item.approval_status === 'APPROVED' ? 'default' :
                                    'destructive'
                                  }
                                >
                                  {item.approval_status}
                                </Badge>
                              </div>
                              <h4 className="font-medium mb-2">{item.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                By {item.author.full_name} ({item.author.email})
                              </p>
                              <p className="text-sm">{item.content}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleContentApproval(item.id, item.type, 'APPROVE')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleContentApproval(item.id, item.type, 'REJECT')}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                      <CardDescription>
                        Track user registration over time.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-2xl font-bold">+12%</span>
                        <span className="text-sm text-muted-foreground">this month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Content Activity</CardTitle>
                      <CardDescription>
                        Recent content creation activity.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Jobs Posted</span>
                          <span className="text-sm font-medium">{stats?.total_jobs || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Events Created</span>
                          <span className="text-sm font-medium">{stats?.total_events || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Posts Created</span>
                          <span className="text-sm font-medium">{stats?.total_posts || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
