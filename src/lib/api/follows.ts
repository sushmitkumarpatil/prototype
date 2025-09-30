import api from '../axios';

export interface FollowStatus {
  userId: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
  followingStatus: string | null;
  followerStatus: string | null;
  canMessage: boolean;
}

export interface FollowCounts {
  userId: number;
  followersCount: number;
  followingCount: number;
}

export interface FollowRequest {
  id: number;
  full_name: string;
  profile: {
    profile_picture_url?: string;
    company?: string;
    job_title?: string;
  };
  requestedAt: string;
}

// Send a follow request
export const sendFollowRequest = async (followingId: number) => {
  const response = await api.post('/api/follows/request', { followingId });
  return response;
};

// Respond to a follow request (accept/reject)
export const respondToFollowRequest = async (followerId: number, action: 'accept' | 'reject') => {
  const response = await api.post('/api/follows/respond', { followerId, action });
  return response;
};

// Unfollow a user
export const unfollowUser = async (followingId: number) => {
  const response = await api.delete(`/api/follows/${followingId}`);
  return response;
};

// Get follow status between current user and another user
export const getFollowStatus = async (userId: number) => {
  const response = await api.get(`/api/follows/status/${userId}`);
  return response;
};

// Get user's followers
export const getFollowers = async (userId?: number, page = 1, limit = 20) => {
  const url = userId ? `/api/follows/followers/${userId}` : '/api/follows/followers';
  const response = await api.get(url, { params: { page, limit } });
  return response;
};

// Get users that the user is following
export const getFollowing = async (userId?: number, page = 1, limit = 20) => {
  const url = userId ? `/api/follows/following/${userId}` : '/api/follows/following';
  const response = await api.get(url, { params: { page, limit } });
  return response;
};

// Get mutual friends (users who follow each other)
export const getMutualFriends = async (page = 1, limit = 50) => {
  try {
    const response = await api.get('/api/follows/mutual-friends', {
      params: { page, limit }
    });
    return response;
  } catch (error: any) {
    console.error('Get mutual friends error:', error);
    throw error;
  }
};

// Get follow counts for a user
export const getFollowCounts = async (userId?: number) => {
  const url = userId ? `/api/follows/counts/${userId}` : '/api/follows/counts';
  const response = await api.get(url);
  return response;
};

// Get pending follow requests for current user
export const getPendingFollowRequests = async (page = 1, limit = 20) => {
  const response = await api.get('/api/follows/requests', { params: { page, limit } });
  return response;
};
