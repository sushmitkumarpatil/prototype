'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
//
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Briefcase, 
  Calendar, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPosts, getJobs, getEvents } from '@/lib/api/content';

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
  const { unreadCount, notifications, refreshNotifications } = useNotifications();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalEvents: 0,
    totalPosts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch counts from APIs (pagination.total reflects visibility and tenant filters)
      const [postsRes, jobsRes, eventsRes] = await Promise.allSettled([
        getPosts(1, 1),
        getJobs(1, 1),
        getEvents(1, 1),
      ]);
      
      setStats((prev) => ({
        ...prev,
        totalPosts: postsRes.status === 'fulfilled' ? postsRes.value?.pagination?.total || 0 : 0,
        totalJobs: jobsRes.status === 'fulfilled' ? jobsRes.value?.pagination?.total || 0 : 0,
        totalEvents: eventsRes.status === 'fulfilled' ? eventsRes.value?.pagination?.total || 0 : 0,
      }));
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
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Badge variant="secondary">
                  {user?.role}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Available opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Events this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  Recent discussions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Community members
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSpinner text="Loading recent activity..." />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New job posted</p>
                      <p className="text-xs text-muted-foreground">Software Engineer at Tech Corp</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Event created</p>
                      <p className="text-xs text-muted-foreground">Alumni Networking Meetup</p>
                    </div>
                    <span className="text-xs text-muted-foreground">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New member joined</p>
                      <p className="text-xs text-muted-foreground">John Doe from Class of 2023</p>
                    </div>
                    <span className="text-xs text-muted-foreground">6 hours ago</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
