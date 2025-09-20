'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Search, Plus, Calendar, Clock } from "lucide-react";
import { NewEventDialog } from "@/components/new-content-dialogs";
import ApprovalStatusBadge from "@/components/approval-status-badge";
import { getEvents, Event } from "@/lib/api/content";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EventCard = ({ event }: { event: Event }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const getAuthorName = (author: any) => {
    if (!author) return 'Unknown User';
    return author.full_name || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="aspect-video w-full object-cover" 
          />
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-primary/60" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-semibold text-accent">
            {formatDate(event.start_time)}
          </p>
          {event.approval_status !== 'APPROVED' && (
            <ApprovalStatusBadge status={event.approval_status} />
          )}
        </div>
        <h3 className="font-headline text-lg font-bold mb-2">{event.title}</h3>
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
              {getInitials(getAuthorName(event.author))}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            Organized by {getAuthorName(event.author)} • {formatDateTime(event.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(event.start_time)}
            {event.end_time && ` - ${formatTime(event.end_time)}`}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1.5 h-4 w-4" /> 
          {event.location || 'Location TBD'}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            if (event.rsvp_link) {
              window.open(event.rsvp_link, '_blank');
            }
          }}
          disabled={!event.rsvp_link}
        >
          {event.rsvp_link ? 'Details & RSVP' : 'Details'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function EventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(1, 50); // Load more events initially
      console.log('Events API response:', response); // Debug log
      
      if (response.success) {
        // Handle different response structures
        const eventsData = response.events || [];
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } else {
        console.error('Events API returned unsuccessful response:', response);
        setEvents([]);
      }
    } catch (error: any) {
      console.error('Load events error:', error);
      setEvents([]); // Set empty array on error
      
      // Don't show error toast for authentication errors
      if (!error.message?.includes('Session expired') && !error.message?.includes('401')) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load events',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // This could be enhanced to make API calls with filters
    // For now, we'll filter client-side
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDate = !dateFilter || 
      new Date(event.start_time).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesDate;
  });

  // Sort events by start time (upcoming first)
  const sortedEvents = filteredEvents.sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Events & Announcements</h1>
          <p className="text-muted-foreground">Connect with the community at upcoming events.</p>
        </div>
        <NewEventDialog onCreated={(event) => {
          setEvents((prev) => [event, ...prev]);
        }}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Announce Event
          </Button>
        </NewEventDialog>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, topic..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedEvents.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {searchQuery || dateFilter 
                    ? 'No events found matching your filters.' 
                    : 'No events announced yet. Be the first to organize something!'
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          sortedEvents.map(event => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
