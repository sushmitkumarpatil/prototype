import api from '../axios';
// Activity API functions and utilities

export interface ActivityItem {
  id: string;
  type: 'post_created' | 'job_posted' | 'event_created' | 'user_joined';
  title: string;
  description: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  created_at: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface RecentActivityResponse {
  success: boolean;
  activities: ActivityItem[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    offset: number;
    days: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    generated_at: string;
  };
}

// Get recent activity for the current user's tenant
export const getRecentActivity = async (
  limit: number = 20,
  days: number = 7,
  page: number = 1
): Promise<RecentActivityResponse> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      days: days.toString(),
      page: page.toString(),
    });

    const response = await api.get(`/api/activity/recent?${params.toString()}`);
    return response as RecentActivityResponse;
  } catch (error: any) {
    console.error('Get recent activity error:', error);
    throw error;
  }
};

// Get icon for activity type
export const getActivityIcon = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'post_created':
      return '📝';
    case 'job_posted':
      return '💼';
    case 'event_created':
      return '📅';
    case 'user_joined':
      return '👋';
    default:
      return '📢';
  }
};

// Get color class for activity type
export const getActivityColor = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'post_created':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'job_posted':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'event_created':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'user_joined':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};




