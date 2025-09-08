'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser, getAuthor, jobs, events, posts } from '@/lib/mock-data';
import { Briefcase, Calendar, Edit, Globe, Linkedin, Mail, MapPin, Phone, Trash2, Camera, Clock, Eye, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { EditImageDialog } from '@/components/edit-image-dialog';
import { EditProfileDialog } from '@/components/edit-profile-dialog';

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

const ProfileEventCard = ({ event, onEdit, onDelete, onView }: { 
  event: any, 
  onEdit?: (event: any) => void,
  onDelete?: (event: any) => void,
  onView?: (event: any) => void
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    
    if (eventDate < now) {
      return { status: 'Past', variant: 'secondary' as const };
    } else if (eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) { // Within 24 hours
      return { status: 'Today', variant: 'destructive' as const };
    } else {
      return { status: 'Upcoming', variant: 'default' as const };
    }
  };

  const eventStatus = getEventStatus(event.date);

  const handleView = () => {
    if (onView) {
      onView(event);
    } else {
      // Default behavior - could open a modal or navigate to event details
      console.log('View event:', event);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
    } else {
      // Default behavior - could open edit modal
      console.log('Edit event:', event);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(event);
    } else {
      // Default behavior - could show confirmation dialog
      console.log('Delete event:', event);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base">{event.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {event.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={eventStatus.variant}>
                    {eventStatus.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={handleView}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const AlumniProfile = () => {
  const [userEvents, setUserEvents] = useState(events.filter(e => e.authorId === currentUser.id));
  const userJobs = jobs.filter(j => j.authorId === currentUser.id);
  const userPosts = posts.filter(p => p.authorId === currentUser.id);

  const handleViewEvent = (event: any) => {
    // Implement view event functionality
    console.log('Viewing event:', event);
    // Could open a modal or navigate to event details page
  };

  const handleEditEvent = (event: any) => {
    // Implement edit event functionality
    console.log('Editing event:', event);
    // Could open an edit modal or navigate to edit page
  };

  const handleDeleteEvent = (event: any) => {
    // Implement delete event functionality
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      setUserEvents(prev => prev.filter(e => e.id !== event.id));
      console.log('Deleted event:', event);
      // Here you would typically make an API call to delete the event
    }
  };

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
                {userEvents.map(event => (
                  <ProfileEventCard 
                    key={event.id} 
                    event={event}
                    onView={handleViewEvent}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
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
  const [profileImage, setProfileImage] = useState(currentUser.avatar);

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="group relative mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="text-5xl">{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <EditImageDialog 
                    onSave={setProfileImage} 
                    aspectRatio={1}
                    trigger={
                        <Button variant="outline" size="icon" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-10 w-10">
                            <Camera className="h-5 w-5" />
                        </Button>
                    }
                 />
              </div>
              <h1 className="font-headline text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-muted-foreground">{currentUser.jobTitle} at {currentUser.company}</p>
              <p className="text-sm text-muted-foreground mt-1">{currentUser.course} &middot; Batch of {currentUser.batch}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{currentUser.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a href={currentUser.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{currentUser.website}</a>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <a href={currentUser.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">LinkedIn</a>
              </div>
               <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{currentUser.location}</span>
              </div>
              
              {/* Edit Profile Button */}
              <div className="pt-3 border-t">
                <EditProfileDialog 
                  currentUser={currentUser}
                  onSave={(updatedData) => {
                    // Handle profile update here
                    console.log('Profile updated:', updatedData);
                    // You can add API call here to update the profile
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2">
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
      </div>
    </div>
  );
}