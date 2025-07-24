'use client';
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

export const NewPostDialog = ({ children }: { children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
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
          <Input id="post-title" placeholder="(Optional) e.g. Advice for Aspiring PMs" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="post-content" className="text-right pt-2">
            Content
          </Label>
          <Textarea id="post-content" placeholder="What's on your mind?" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-accent hover:bg-accent/90">Post</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const NewJobDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-[500px]">
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
          <Input id="job-title" placeholder="e.g. Frontend Developer" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="company" className="text-right">
            Company
          </Label>
          <Input id="company" placeholder="e.g. Innovate Corp" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <Input id="location" placeholder="e.g. Remote or Mumbai" className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="job-type" className="text-right">
            Job Type
          </Label>
            <Select>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select job type" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">
            Description
          </Label>
          <Textarea id="description" placeholder="Job responsibilities, qualifications, etc." className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-accent hover:bg-accent/90">Post Job</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export const NewEventDialog = ({ children }: { children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
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
          <Input id="event-title" placeholder="e.g. Alumni Networking Meetup" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-date" className="text-right">
            Date
          </Label>
          <Input id="event-date" type="date" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-location" className="text-right">
            Location
          </Label>
          <Input id="event-location" placeholder="e.g. Online or College Auditorium" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="event-description" className="text-right pt-2">
            Description
          </Label>
          <Textarea id="event-description" placeholder="Describe the event..." className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-accent hover:bg-accent/90">Announce Event</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)