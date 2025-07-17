'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { jobs, events, posts, getAuthor, currentUser } from '@/lib/mock-data';
import { Briefcase, Calendar, Heart, MapPin, MessageSquare, PenSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const feedItems = [
  ...jobs.map(item => ({ ...item, type: 'job' })),
  ...events.map(item => ({ ...item, type: 'event' })),
  ...posts.map(item => ({ ...item, type: 'post' })),
].sort((a, b) => new Date(b.postedAt || b.date).getTime() - new Date(a.postedAt || a.date).getTime());


const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
}

const FeedCard = ({ item }: { item: any }) => {
  const author = getAuthor(item.authorId);
  if (!author) return null;

  const renderCardContent = () => {
    switch (item.type) {
      case 'job':
        return (
          <>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.company} &middot; {item.experienceLevel}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1.5 h-4 w-4" /> {item.location}
                </div>
                <Button variant="outline" size="sm">View Job</Button>
            </CardFooter>
          </>
        );
      case 'event':
        return (
          <>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
                  <CardDescription>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img src={item.image} alt={item.title} data-ai-hint="event cover" className="mb-4 aspect-video w-full rounded-lg object-cover" />
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </CardContent>
             <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1.5 h-4 w-4" /> {item.location}
                </div>
                <Button variant="outline" size="sm">View Event</Button>
            </CardFooter>
          </>
        );
      case 'post':
        return (
          <>
            <CardHeader>
                {item.title && <CardTitle className="font-headline text-lg">{item.title}</CardTitle>}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.content}</p>
            </CardContent>
            <CardFooter>
                <Button variant="ghost" size="sm"><Heart className="mr-2 h-4 w-4"/>Like</Button>
            </CardFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b bg-muted/30 p-4">
        <Avatar>
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5 text-sm">
          <span className="font-semibold">{author.name}</span>
          <span className="text-muted-foreground">{author.jobTitle} at {author.company}</span>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{item.postedAt || item.type}</span>
      </div>
      {renderCardContent()}
    </Card>
  );
};


export default function DashboardPage() {
  const [filter, setFilter] = useState('All');
  const filteredItems = feedItems.filter(item => {
    if (filter === 'All') return true;
    return item.type.toLowerCase() === filter.toLowerCase().slice(0, -1);
  });

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentUser.name}! Here's what's new.</p>
        </div>
        {currentUser.role === 'alumnus' && (
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        )}
      </div>

      <div className="mb-6 flex items-center gap-2">
        <h3 className="text-sm font-semibold">Filter feed:</h3>
        {['All', 'Jobs', 'Events', 'Posts'].map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>
      
      <div className="space-y-6">
        {filteredItems.map(item => <FeedCard key={`${item.type}-${item.id}`} item={item} />)}
      </div>
    </div>
  );
}
