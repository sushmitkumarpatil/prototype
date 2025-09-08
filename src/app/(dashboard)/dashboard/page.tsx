'use client';

import { FeedCard } from '@/components/feed-card';
import { Button } from '@/components/ui/button';
import { currentUser, events, jobs, posts } from '@/lib/mock-data';
import { useMemo, useState } from 'react';

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
      <div className="mb-8 p-8 bg-gradient-to-br from-card via-primary/5 to-accent/5 rounded-xl border border-primary/20 shadow-xl">
        <h1 className="font-headline text-4xl font-bold text-card-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Welcome back, <span className="text-primary font-semibold">{currentUser.name}</span>! Here's what's new.</p>
        <div className="mt-8 flex items-center gap-3">
            <h3 className="text-sm font-semibold text-card-foreground">Filter feed:</h3>
            {['All', 'Jobs', 'Events', 'Posts'].map(f => (
                <Button 
                  key={f} 
                  variant={filter === f ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilter(f)}
                  className={filter === f 
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300' 
                    : 'text-muted-foreground hover:text-card-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 border border-primary/20 hover:border-primary/40 transition-all duration-300'
                  }
                >
                {f}
                </Button>
            ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => <FeedCard key={`${item.type}-${item.id}`} item={item} />)
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-card via-primary/5 to-accent/5 rounded-xl border border-primary/20">
            <div className="text-muted-foreground text-xl mb-2">No {filter.toLowerCase()} found</div>
            <p className="text-sm text-muted-foreground">Try adjusting your filter or check back later</p>
            <div className="mt-4">
              <Button 
                onClick={() => setFilter('All')} 
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Show All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
