'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Briefcase, 
  Calendar, 
  FileText,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDashboardStats, type DashboardResponse } from '@/lib/api/admin';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error('Failed to fetch dashboard stats');
      }
    } catch (err: any) {
      console.error('Dashboard stats error:', err);
      setError(err.message || 'Failed to load dashboard data');
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated admin; middleware should also protect, but keep as a guard
    const isAdmin = user && (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN');
    if (isAuthenticated && isAdmin) {
      fetchDashboardStats();
    } else if (isAuthenticated && !isAdmin) {
      // User is authenticated but not admin - redirect them
      window.location.href = '/dashboard';
    } else if (!isAuthenticated) {
      // Not authenticated at all - redirect to admin login
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, user]);

  const handleRefresh = () => {
    fetchDashboardStats();
  };

  // Show loading only for authenticated admins
  const isAdmin = user && (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN');
  if (loading && isAuthenticated && isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Don't show anything while redirecting
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (error || !stats) {
    const isAuthAdmin = user && (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN');
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">{isAuthAdmin ? 'Failed to Load Dashboard' : 'Admin Access Required'}</h2>
        <p className="text-gray-600 text-center max-w-md">
          {isAuthAdmin
            ? (error || 'Unable to load dashboard data. Please check your connection and try again.')
            : 'You do not have permission to view this page. Please sign in with an admin account.'}
        </p>
        {isAuthAdmin ? (
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        ) : (
          <Link href="/admin/login">
            <Button className="mt-2">Go to Admin Login</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your platform's activity and statistics</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.approved} active users
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.users.pending}</div>
            <p className="text-xs text-muted-foreground">
              Users awaiting approval
            </p>
          </CardContent>
        </Card>

        {/* Total Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Posts</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.content.jobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total job posts
            </p>
          </CardContent>
        </Card>

        {/* Total Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.content.events.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Content Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Content Overview
            </CardTitle>
            <CardDescription>
              Summary of all content on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                <span>General Posts</span>
              </div>
              <Badge variant="secondary">{stats.content.posts}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-green-500" />
                <span>Job Posts</span>
              </div>
              <Badge variant="secondary">{stats.content.jobs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                <span>Events</span>
              </div>
              <Badge variant="secondary">{stats.content.events}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              Items requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-orange-500" />
                <span>User Accounts</span>
              </div>
              <Badge variant={stats.users.pending > 0 ? "destructive" : "secondary"}>
                {stats.users.pending}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-orange-500" />
                <span>Job Posts</span>
              </div>
              <Badge variant={stats.pending?.jobs > 0 ? "destructive" : "secondary"}>
                {stats.pending?.jobs || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                <span>Events</span>
              </div>
              <Badge variant={stats.pending?.events > 0 ? "destructive" : "secondary"}>
                {stats.pending?.events || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/admin/users" className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
                {stats.users.pending > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {stats.users.pending} pending
                  </Badge>
                )}
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/admin/approvals" className="flex flex-col items-center space-y-2">
                <Clock className="h-6 w-6" />
                <span>Approvals</span>
                {(stats.users.pending > 0 || (stats.pending?.jobs || 0) > 0 || (stats.pending?.events || 0) > 0) && (
                  <Badge variant="destructive" className="text-xs">
                    {stats.users.pending + (stats.pending?.jobs || 0) + (stats.pending?.events || 0)} pending
                  </Badge>
                )}
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/admin/content" className="flex flex-col items-center space-y-2">
                <FileText className="h-6 w-6" />
                <span>Content</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/admin/reports" className="flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Overview for Super Admins */}
      {stats.tenants && stats.tenants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Tenant Overview
            </CardTitle>
            <CardDescription>
              Overview of all tenants in the system (Super Admin view)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.tenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{tenant.name}</h4>
                    <p className="text-sm text-muted-foreground">{tenant.subdomain}.ionalumni.com</p>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{tenant._count.users}</div>
                      <div className="text-muted-foreground">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{tenant._count.general_posts}</div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{tenant._count.jobs}</div>
                      <div className="text-muted-foreground">Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{tenant._count.events}</div>
                      <div className="text-muted-foreground">Events</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
