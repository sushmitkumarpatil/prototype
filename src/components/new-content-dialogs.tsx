'use client';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { createPost, createJob, createEvent } from '@/lib/api/content';

export const NewPostDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Content is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await createPost({
        title: formData.title.trim() || undefined,
        content: formData.content.trim(),
        is_public: true,
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Post created successfully!',
          variant: 'success',
        });
        setFormData({ title: '', content: '' });
        setOpen(false);
        // Refresh the page to show the new post
        window.location.reload();
      } else {
        throw new Error(response.message || 'Failed to create post');
      }
    } catch (error: any) {
      console.error('Create post error:', error);
      
      // Don't show error toast for authentication errors - let the auth system handle it
      if (!error.message?.includes('Session expired') && !error.message?.includes('401')) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create post',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts, experiences, or announcements with the community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="post-title" className="text-right">
                Title
              </Label>
              <Input 
                id="post-title" 
                placeholder="(Optional) e.g. Advice for Aspiring PMs" 
                className="col-span-3"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="post-content" className="text-right pt-2">
                Content
              </Label>
              <Textarea 
                id="post-content" 
                placeholder="What's on your mind?" 
                className="col-span-3"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const NewJobDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    description: '',
    salary: '',
    requirements: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.company.trim() || !formData.description.trim()) {
      toast({
        title: 'Error',
        description: 'Title, company, and description are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await createJob({
        title: formData.title.trim(),
        company_name: formData.company.trim(),
        location: formData.location.trim() || undefined,
        description: formData.description.trim(),
        apply_link_or_email: 'contact@company.com', // Default contact
        job_type: formData.jobType ? formData.jobType.toUpperCase() as 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' : 'FULL_TIME',
        work_mode: 'Remote' as 'Remote' | 'Hybrid' | 'Onsite',
        experience_level: formData.requirements.trim() || undefined,
        is_public: true,
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Job posted successfully!',
          variant: 'success',
        });
        setFormData({
          title: '',
          company: '',
          location: '',
          jobType: '',
          description: '',
          salary: '',
          requirements: '',
        });
        setOpen(false);
        // Refresh the page to show the new job
        window.location.reload();
      } else {
        throw new Error(response.message || 'Failed to post job');
      }
    } catch (error: any) {
      console.error('Create job error:', error);
      
      // Don't show error toast for authentication errors - let the auth system handle it
      if (!error.message?.includes('Session expired') && !error.message?.includes('401')) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to post job',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Post a New Job</DialogTitle>
            <DialogDescription>
              Fill in the details below to post a new job opportunity for students and fellow alumni.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="job-title" className="text-right">
                Job Title
              </Label>
              <Input 
                id="job-title" 
                placeholder="e.g. Frontend Developer" 
                className="col-span-3"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input 
                id="company" 
                placeholder="e.g. Innovate Corp" 
                className="col-span-3"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input 
                id="location" 
                placeholder="e.g. Remote or Mumbai" 
                className="col-span-3"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="job-type" className="text-right">
                Job Type
              </Label>
              <Select value={formData.jobType} onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))} disabled={loading}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salary
              </Label>
              <Input 
                id="salary" 
                placeholder="e.g. ₹8-12 LPA" 
                className="col-span-3"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea 
                id="description" 
                placeholder="Job responsibilities, qualifications, etc." 
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="requirements" className="text-right pt-2">
                Requirements
              </Label>
              <Textarea 
                id="requirements" 
                placeholder="Skills, experience, etc." 
                className="col-span-3"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const NewEventDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    maxAttendees: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.eventDate) {
      toast({
        title: 'Error',
        description: 'Title, description, and date are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Combine date and time
      const startDateTime = new Date(`${formData.eventDate}T${formData.startTime || '09:00'}`);
      const endDateTime = new Date(`${formData.eventDate}T${formData.endTime || '17:00'}`);
      
      const response = await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim() || undefined,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        is_public: true,
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Event announced successfully!',
          variant: 'success',
        });
        setFormData({
          title: '',
          description: '',
          location: '',
          eventDate: '',
          startTime: '',
          endTime: '',
          maxAttendees: '',
        });
        setOpen(false);
        // Refresh the page to show the new event
        window.location.reload();
      } else {
        throw new Error(response.message || 'Failed to announce event');
      }
    } catch (error: any) {
      console.error('Create event error:', error);
      
      // Don't show error toast for authentication errors - let the auth system handle it
      if (!error.message?.includes('Session expired') && !error.message?.includes('401')) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to announce event',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Announce a New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to announce a new event to the community.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-title" className="text-right">
                Title
              </Label>
              <Input 
                id="event-title" 
                placeholder="e.g. Alumni Networking Meetup" 
                className="col-span-3"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                Date
              </Label>
              <Input 
                id="event-date" 
                type="date" 
                className="col-span-3"
                value={formData.eventDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-time" className="text-right">
                Start Time
              </Label>
              <Input 
                id="start-time" 
                type="time" 
                className="col-span-3"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">
                End Time
              </Label>
              <Input 
                id="end-time" 
                type="time" 
                className="col-span-3"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-location" className="text-right">
                Location
              </Label>
              <Input 
                id="event-location" 
                placeholder="e.g. Online or College Auditorium" 
                className="col-span-3"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-attendees" className="text-right">
                Max Attendees
              </Label>
              <Input 
                id="max-attendees" 
                type="number" 
                placeholder="Optional" 
                className="col-span-3"
                value={formData.maxAttendees}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="event-description" className="text-right pt-2">
                Description
              </Label>
              <Textarea 
                id="event-description" 
                placeholder="Describe the event..." 
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={loading}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={loading}>
              {loading ? 'Announcing...' : 'Announce Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};