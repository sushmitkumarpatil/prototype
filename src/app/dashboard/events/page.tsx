'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { currentUser, events, getAuthor } from "@/lib/mock-data";
import { Calendar, MapPin, PlusCircle, Search } from "lucide-react";

const EventCard = ({ event }: { event: (typeof events)[0] }) => {
  const author = getAuthor(event.authorId);
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={event.image} alt={event.title} data-ai-hint="event poster" className="aspect-video w-full object-cover" />
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-accent">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h3 className="font-headline text-lg font-bold">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-4 w-4" /> {event.location}
        </div>
        <Button variant="outline" size="sm">Details & RSVP</Button>
      </CardFooter>
    </Card>
  )
}

const NewEventDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="bg-accent hover:bg-accent/90">
        <PlusCircle className="mr-2 h-4 w-4" />
        Announce New Event
      </Button>
    </DialogTrigger>
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

export default function EventsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Events & Announcements</h1>
          <p className="text-muted-foreground">Connect with the community at upcoming events.</p>
        </div>
        {currentUser.role === 'alumnus' && (
          <NewEventDialog />
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by title, topic..." className="pl-9" />
                </div>
                <Input type="date" />
                <Button>Apply Filters</Button>
           </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
