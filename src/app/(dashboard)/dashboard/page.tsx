'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { currentUser, events, jobs, posts } from '@/lib/mock-data';
import { FeedCard } from '@/components/feed-card';

export default function DashboardPage() {
  const [filter, setFilter] = useState('All');

  const feedItems = useMemo(() => {
    return [
      ...jobs.map(item => ({ ...item, type: 'job' })),
      ...events.map(item => ({ ...item, type: 'event' })),
      ...posts.map(item => ({ ...item, type: 'post' })),
    ].sort((a, b) => new Date(b.postedAt || b.date).getTime() - new Date(a.postedAt || a.date).getTime());
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'All') return feedItems;
    return feedItems.filter(item => item.type.toLowerCase() === filter.toLowerCase().slice(0, -1));
  }, [filter, feedItems]);

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser.name}! Here's what's new.</p>
        <div className="mt-4 flex items-center gap-2">
            <h3 className="text-sm font-semibold">Filter feed:</h3>
            {['All', 'Jobs', 'Events', 'Posts'].map(f => (
                <Button key={f} variant={filter === f ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(f)}>
                {f}
                </Button>
            ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredItems.map(item => <FeedCard key={`${item.type}-${item.id}`} item={item} />)}
      </div>
    </div>
  );
}
