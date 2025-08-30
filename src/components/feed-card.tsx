'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthor } from '@/lib/mock-data';
import { Briefcase, Calendar, Heart, MapPin } from 'lucide-react';

const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
}

export const FeedCard = ({ item }: { item: any }) => {
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
                <Image src={item.image} alt={item.title} width={500} height={281} data-ai-hint="event cover" className="mb-4 aspect-video w-full rounded-lg object-cover" />
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
            <CardFooter className="gap-2">
                <Button variant="ghost" size="sm"><Heart className="mr-2 h-4 w-4"/>Like</Button>
                <Button variant="ghost" size="sm">Comment</Button>
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