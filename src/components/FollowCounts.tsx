'use client';

import { useState, useEffect } from 'react';
import { getFollowCounts, type FollowCounts as FollowCountsType } from '@/lib/api/follows';

interface FollowCountsProps {
  userId?: number;
  className?: string;
}

export function FollowCounts({ userId, className = '' }: FollowCountsProps) {
  const [counts, setCounts] = useState<FollowCountsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowCounts();
  }, [userId]);

  const loadFollowCounts = async () => {
    try {
      setLoading(true);
      const response = await getFollowCounts(userId);
      if (response?.success) {
        setCounts(response.data);
      }
    } catch (error: any) {
      console.error('Error loading follow counts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex gap-4 ${className}`}>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!counts) {
    return null;
  }

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="text-sm">
        <span className="font-semibold">{counts.followersCount}</span>
        <span className="text-muted-foreground ml-1">
          {counts.followersCount === 1 ? 'Follower' : 'Followers'}
        </span>
      </div>
      <div className="text-sm">
        <span className="font-semibold">{counts.followingCount}</span>
        <span className="text-muted-foreground ml-1">Following</span>
      </div>
    </div>
  );
}
