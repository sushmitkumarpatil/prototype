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
import { createPost, createJob, createEvent, uploadEventImage } from '@/lib/api/content';

export const NewPostDialog = ({ children, onCreated }: { children: React.ReactNode; onCreated?: (post: any) => void }) => {
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
        const status = response.post?.approval_status;
        const pending = status === 'PENDING' || /pending/i.test(response.message || '');
        toast({
          title: pending ? 'Submitted for Approval' : 'Success',
          description: pending
            ? 'Your post was created and is pending admin approval. It will appear once approved.'
            : 'Post created and published.',
          variant: 'success',
        });
        onCreated?.(response.post);
        setFormData({ title: '', content: '' });
        setOpen(false);
      } else {
        throw new Error(response.message || 'Failed to create post');
      }
    } catch (error: any) {
      console.error('Create post error:', error);
      const msg = String(error.message || '').toLowerCase();
      if (msg.includes('pending') && msg.includes('approval')) {
        toast({
          title: 'Account Pending Approval',
          description: 'Your account must be approved before you can create content. Please wait for admin approval or contact support.',
          variant: 'destructive',
        });
      } else if (!msg.includes('session expired') && !msg.includes('401')) {
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

export const NewJobDialog = ({ children, onCreated }: { children: React.ReactNode; onCreated?: (job: any) => void }) => {
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
        job_type: formData.jobType ? formData.jobType.toUpperCase().replace('-', '_') as 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' : 'FULL_TIME',
        work_mode: 'Remote' as 'Remote' | 'Hybrid' | 'Onsite',
        experience_level: formData.requirements.trim() || undefined,
        is_public: true,
      });

      if (response.success) {
        const status = response.job?.approval_status;
        const pending = status === 'PENDING' || /pending/i.test(response.message || '');
        toast({
          title: pending ? 'Submitted for Approval' : 'Success',
          description: pending
            ? 'Your job was posted and is pending admin approval. It will appear once approved.'
            : 'Job posted and published.',
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
        onCreated?.(response.job);
        setOpen(false);
      } else {
        throw new Error(response.message || 'Failed to post job');
      }
    } catch (error: any) {
      console.error('Create job error:', error);
      const msg = String(error.message || '').toLowerCase();
      if (msg.includes('pending') && msg.includes('approval')) {
        toast({
          title: 'Account Pending Approval',
          description: 'Your account must be approved before you can post jobs. Please wait for admin approval or contact support.',
          variant: 'destructive',
        });
      } else if (!msg.includes('session expired') && !msg.includes('401')) {
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

export const NewEventDialog = ({ children, onCreated }: { children: React.ReactNode; onCreated?: (event: any) => void }) => {
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file (JPG, PNG, GIF, etc.)',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.eventDate || !imageFile) {
      toast({
        title: 'Error',
        description: 'Title, description, date, and image are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      // First upload the image
      let imageUrl = '';
      if (imageFile) {
        const uploadResponse = await uploadEventImage(imageFile);
        if (uploadResponse.success) {
          imageUrl = uploadResponse.image_url;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.eventDate}T${formData.startTime || '09:00'}`);
      const endDateTime = new Date(`${formData.eventDate}T${formData.endTime || '17:00'}`);

      const response = await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim() || undefined,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        image_url: imageUrl || undefined,
        is_public: true,
      });

      if (response.success) {
        const status = response.data?.event?.approval_status;
        const pending = status === 'PENDING' || /pending/i.test(response.message || '');
        toast({
          title: pending ? 'Submitted for Approval' : 'Success',
          description: pending
            ? 'Your event was created and is pending admin approval. It will appear once approved.'
            : 'Event announced and published.',
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
        setImageFile(null);
        setImagePreview(null);
        onCreated?.(response.data?.event);
        setOpen(false);
      } else {
        throw new Error(response.message || 'Failed to announce event');
      }
    } catch (error: any) {
      console.error('Create event error:', error);
      const msg = String(error.message || '').toLowerCase();
      if (msg.includes('pending') && msg.includes('approval')) {
        toast({
          title: 'Account Pending Approval',
          description: 'Your account must be approved before you can announce events. Please wait for admin approval or contact support.',
          variant: 'destructive',
        });
      } else if (!msg.includes('session expired') && !msg.includes('401')) {
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
              <Label htmlFor="event-image" className="text-right">
                Image *
              </Label>
              <div className="col-span-3">
                <Input
                  id="event-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  required
                  className="mb-2"
                />
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
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
