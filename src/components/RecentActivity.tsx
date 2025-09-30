'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, RefreshCw, Activity } from 'lucide-react';
import { 
  getRecentActivity, 
  type ActivityItem, 
  type RecentActivityResponse,
  getActivityIcon,
  getActivityColor,
  formatRelativeTime 
} from '@/lib/api/activity';

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<RecentActivityResponse['meta'] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const itemsPerPage = 10;

  const loadActivity = async (page: number = 1, showRefreshing: boolean = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await getRecentActivity(itemsPerPage, 7, page);
      setActivities(response.activities);
      setMeta(response.meta);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading activity:', err);
      setError('Failed to load recent activity');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivity(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPages || 1)) {
      loadActivity(newPage);
    }
  };

  const handleRefresh = () => {
    loadActivity(currentPage, true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  if (loading && !refreshing) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadActivity(1)} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
          aria-label="Refresh recent activity"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-6">
            <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No recent activity found</p>
          </div>
        ) : (
          <>
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-all duration-200"
                role="listitem"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={activity.user.avatar} alt={`${activity.user.name}'s avatar`} />
                  <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    {getInitials(activity.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">{getActivityIcon(activity.type)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium leading-tight">{activity.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {activity.user.name}</span>
                    <span>{formatRelativeTime(activity.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {meta.currentPage} of {meta.totalPages} ({meta.total} total)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!meta.hasPreviousPage}
                    aria-label="Go to previous page"
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!meta.hasNextPage}
                    aria-label="Go to next page"
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
