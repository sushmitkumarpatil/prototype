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
import { EventDetailsDialog } from "@/components/event-details-dialog";
import { getEvents, Event } from "@/lib/api/content";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EventCard = ({ event, onViewDetails }: { event: Event; onViewDetails: (event: Event) => void }) => {
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

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null;
    // If it's already a full URL (external), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a relative path (upload), prepend the backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8000${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        {event.image_url ? (
          <img
            src={getImageUrl(event.image_url)}
            alt={event.title}
            className="aspect-video w-full object-cover"
            onError={(e) => {
              console.error('Failed to load image:', event.image_url);
              // Hide the image and show the fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        {!event.image_url && (
          <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-primary/60" />
          </div>
        )}
        {/* Fallback div for failed image loads */}
        <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center" style={{ display: 'none' }}>
          <Calendar className="h-12 w-12 text-primary/60" />
        </div>
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
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-4 w-4" />
            {event.location || 'Location TBD'}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(event)}
          >
            Show Details
          </Button>
        </div>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 6;
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);

  useEffect(() => {
    loadEvents();

    // Listen for real-time updates
    const handleRefreshEvents = () => {
      loadEvents();
    };

    window.addEventListener('refreshEvents', handleRefreshEvents);

    return () => {
      window.removeEventListener('refreshEvents', handleRefreshEvents);
    };
  }, [currentPage]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(currentPage, eventsPerPage);
      console.log('Events API response:', response); // Debug log

      if (response.success) {
        // Handle different response structures
        const eventsData = response.events || [];
        setEvents(Array.isArray(eventsData) ? eventsData : []);

        // Set pagination info
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotalEvents(response.pagination.total);
        } else {
          // Calculate pagination from response
          const total = response.total || eventsData.length;
          setTotalEvents(total);
          setTotalPages(Math.ceil(total / eventsPerPage));
        }
      } else {
        console.error('Events API returned unsuccessful response:', response);
        setEvents([]);
        setTotalPages(1);
        setTotalEvents(0);
      }
    } catch (error: any) {
      console.error('Load events error:', error);
      setEvents([]); // Set empty array on error
      setTotalPages(1);
      setTotalEvents(0);

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

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
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
          sortedEvents.map(event => <EventCard key={event.id} event={event} onViewDetails={handleViewDetails} />)
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * eventsPerPage) + 1} to {Math.min(currentPage * eventsPerPage, totalEvents)} of {totalEvents} events
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        open={eventDetailsOpen}
        onOpenChange={setEventDetailsOpen}
        onRSVPUpdate={loadEvents}
      />
    </div>
  );
}
