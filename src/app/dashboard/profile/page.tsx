'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser, getAuthor, jobs, events, posts } from '@/lib/mock-data';
import { Building, Briefcase, Calendar, Edit, Globe, Linkedin, Mail, MapPin, PenSquare, Phone, Trash2 } from 'lucide-react';
import Link from 'next/link';

const getInitials = (name: string) => {
  return name.split(' ').map((n) => n[0]).join('');
}

const ProfilePostCard = ({ item, type }: { item: any, type: 'Job' | 'Event' | 'Post' }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
            <div>
                <h3 className="font-semibold">{item.title || `${type} Post`}</h3>
                <p className="text-sm text-muted-foreground">{item.company || new Date(item.date || item.postedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

const AlumniProfile = () => {
  const userJobs = jobs.filter(j => j.authorId === currentUser.id);
  const userEvents = events.filter(e => e.authorId === currentUser.id);
  const userPosts = posts.filter(p => p.authorId === currentUser.id);

  return (
    <TabsContent value="profile" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
          <CardDescription>Manage your job and company information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" defaultValue={currentUser.company} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" defaultValue={currentUser.jobTitle} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
            <Input id="linkedin" defaultValue={currentUser.linkedin} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My Content</CardTitle>
          <CardDescription>View and manage your posts.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList>
                <TabsTrigger value="jobs">Job Posts ({userJobs.length})</TabsTrigger>
                <TabsTrigger value="events">Events ({userEvents.length})</TabsTrigger>
                <TabsTrigger value="posts">General Posts ({userPosts.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="jobs" className="mt-4 space-y-4">
                {userJobs.map(job => <ProfilePostCard key={job.id} item={job} type="Job" />)}
              </TabsContent>
              <TabsContent value="events" className="mt-4 space-y-4">
                {userEvents.map(event => <ProfilePostCard key={event.id} item={event} type="Event" />)}
              </TabsContent>
              <TabsContent value="posts" className="mt-4 space-y-4">
                {userPosts.map(post => <ProfilePostCard key={post.id} item={post} type="Post" />)}
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

const StudentProfile = () => {
    return (
        <TabsContent value="profile" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Followed Alumni</CardTitle>
                    <CardDescription>Manage the alumni you follow for updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {currentUser.followedAlumni?.map(id => {
                        const alum = getAuthor(id);
                        if (!alum) return null;
                        return (
                            <div key={id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={alum.avatar} />
                                        <AvatarFallback>{getInitials(alum.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{alum.name}</p>
                                        <p className="text-sm text-muted-foreground">{alum.jobTitle} at {alum.company}</p>
                                    </div>
                                </div>
                                <Button variant="outline">Unfollow</Button>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </TabsContent>
    )
}


export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="relative mb-6">
        <div className="h-36 w-full rounded-lg bg-muted" data-ai-hint="profile banner">
            <img src="https://placehold.co/1200x200" className="h-full w-full object-cover rounded-lg" alt="Profile banner" />
        </div>
        <div className="absolute -bottom-12 left-6">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback className="text-3xl">{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="mt-16 flex items-end justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{currentUser.name}</h1>
          <p className="text-muted-foreground">{currentUser.course} &middot; Batch of {currentUser.batch}</p>
        </div>
        <Button><Edit className="mr-2 h-4 w-4" />Edit Profile</Button>
      </div>
      <Separator className="my-6" />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="settings">Privacy & Settings</TabsTrigger>
        </TabsList>

        {currentUser.role === 'alumnus' ? <AlumniProfile /> : <StudentProfile />}

        <TabsContent value="settings">
           <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control what information is visible to others.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="show-contact" className="font-semibold">Show Contact Number</Label>
                        <p className="text-xs text-muted-foreground">Allow students and alumni to see your phone number.</p>
                    </div>
                    <Switch id="show-contact" />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="show-email" className="font-semibold">Show Email Address</Label>
                        <p className="text-xs text-muted-foreground">Allow students and alumni to see your email.</p>
                    </div>
                    <Switch id="show-email" defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="show-location" className="font-semibold">Show Current Location</Label>
                        <p className="text-xs text-muted-foreground">Display your city on your public profile.</p>
                    </div>
                    <Switch id="show-location" defaultChecked />
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
