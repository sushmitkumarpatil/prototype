'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
//
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Briefcase,
  Calendar,
  FileText,
  Users,
  LogOut,
  Plus,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { getPosts, getJobs, getEvents, getUserStats } from '@/lib/api/content';
import { RecentActivity } from '@/components/RecentActivity';
import { ContentApprovalStatus } from '@/components/ContentApprovalStatus';
import { UserApprovalDashboard } from '@/components/UserApprovalDashboard';

// Helper function to get welcome message
function getWelcomeMessage(user: any) {
  if (!user) return 'Welcome!';
  
  // Get first name from email or full name
  const getFirstName = (user: any) => {
    if (user.full_name) {
      return user.full_name.split(' ')[0];
    }
    // Extract first name from email (before @)
    if (user.email) {
      const emailPart = user.email.split('@')[0];
      // Capitalize first letter
      return emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
    }
    return 'User';
  };
  
  const firstName = getFirstName(user);
  const welcomeType = localStorage.getItem('welcomeMessage');
  
  if (welcomeType === 'back') {
    return `Welcome back, ${firstName}!`;
  } else {
    return `Welcome, ${firstName}!`;
  }
}

export default function DashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    myJobs: 0,
    myEvents: 0,
    myPosts: 0,
    pendingJobs: 0,
    pendingEvents: 0,
    pendingPosts: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }

    // Listen for real-time updates
    const handleRefreshData = () => {
      if (user) {
        loadDashboardData();
      }
    };

    // Function to handle activity refresh (can be used for future activity updates)
    const handleRefreshActivity = () => {
      // This can be used to refresh activity data specifically
      // For now, we'll just refresh the dashboard data
      if (user) {
        loadDashboardData();
      }
    };

    window.addEventListener('refreshPosts', handleRefreshData);
    window.addEventListener('refreshJobs', handleRefreshData);
    window.addEventListener('refreshEvents', handleRefreshData);

    // Listen for activity updates
    window.addEventListener('refreshPosts', handleRefreshActivity);
    window.addEventListener('refreshJobs', handleRefreshActivity);
    window.addEventListener('refreshEvents', handleRefreshActivity);

    return () => {
      window.removeEventListener('refreshPosts', handleRefreshData);
      window.removeEventListener('refreshJobs', handleRefreshData);
      window.removeEventListener('refreshEvents', handleRefreshData);
      window.removeEventListener('refreshPosts', handleRefreshActivity);
      window.removeEventListener('refreshJobs', handleRefreshActivity);
      window.removeEventListener('refreshEvents', handleRefreshActivity);
    };
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user-specific stats
      const statsResponse = await getUserStats();
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
    } catch (err: any) {
      console.error('Dashboard data loading error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (authLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load dashboard"
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">User Dashboard</h1>
                <Badge variant="secondary">
                  {user?.role}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">

                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {getWelcomeMessage(user)}
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening in your alumni community.
            </p>
          </div>

          {/* Stats Grid - User-specific stats matching admin dashboard style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myJobs || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingJobs || 0} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingEvents || 0} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myPosts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingPosts || 0} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unreadNotifications || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Unread messages
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Jobs</CardTitle>
                <CardDescription>
                  Find and post job opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/jobs">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/jobs/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Job
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Discover and create events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Events
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/events/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Connect with fellow alumni
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <Link href="/posts">
                    <FileText className="h-4 w-4 mr-2" />
                    View Posts
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/posts/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Content Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <RecentActivity />
            <UserApprovalDashboard />
          </div>
        </main>
      </div>
    </>
  );
}
