'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  CalendarPlus,
  Heart,
  Check,
  X
} from 'lucide-react';
import { Event, rsvpToEvent, getUserRSVP, cancelRSVP } from '@/lib/api/content';
import ApprovalStatusBadge from './approval-status-badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRSVPUpdate?: () => void;
}

export function EventDetailsDialog({ event, open, onOpenChange, onRSVPUpdate }: EventDetailsDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [rsvpStatus, setRsvpStatus] = useState<'INTERESTED' | 'GOING' | 'NOT_GOING' | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpCounts, setRsvpCounts] = useState({
    interested: 0,
    going: 0,
    notGoing: 0,
    total: 0,
  });

  // Load user's RSVP status when dialog opens
  useEffect(() => {
    if (open && event) {
      loadUserRSVP();
      calculateRSVPCounts();
    }
  }, [open, event]);

  const loadUserRSVP = async () => {
    try {
      const response = await getUserRSVP(event.id);
      if (response.data?.rsvp) {
        setRsvpStatus(response.data.rsvp.status);
      } else {
        setRsvpStatus(null);
      }
    } catch (error) {
      console.error('Error loading RSVP:', error);
    }
  };

  const calculateRSVPCounts = () => {
    if (event.rsvps) {
      const counts = {
        interested: event.rsvps.filter(r => r.status === 'INTERESTED').length,
        going: event.rsvps.filter(r => r.status === 'GOING').length,
        notGoing: event.rsvps.filter(r => r.status === 'NOT_GOING').length,
        total: event.rsvps.length,
      };
      setRsvpCounts(counts);
    }
  };

  const handleRSVPAction = async (status: 'INTERESTED' | 'GOING' | 'NOT_GOING') => {
    try {
      setRsvpLoading(true);
      const response = await rsvpToEvent(event.id, status);

      if (response.success) {
        setRsvpStatus(status);

        // Update counts from response
        if (response.data?.counts) {
          setRsvpCounts(response.data.counts);
        }

        toast({
          title: 'RSVP Updated',
          description: `You marked yourself as ${status.toLowerCase().replace('_', ' ')}`,
        });

        // Trigger parent refresh
        if (onRSVPUpdate) {
          onRSVPUpdate();
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update RSVP',
        variant: 'destructive',
      });
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    try {
      setRsvpLoading(true);
      const response = await cancelRSVP(event.id);

      if (response.success) {
        setRsvpStatus(null);

        // Update counts from response
        if (response.data?.counts) {
          setRsvpCounts(response.data.counts);
        }

        toast({
          title: 'RSVP Cancelled',
          description: 'Your RSVP has been cancelled',
        });

        // Trigger parent refresh
        if (onRSVPUpdate) {
          onRSVPUpdate();
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to cancel RSVP',
        variant: 'destructive',
      });
    } finally {
      setRsvpLoading(false);
    }
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

  const getInitials = (name: string | undefined) => {
    if (!name) return '??';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const getAuthorName = (author: any) => {
    if (!author) return 'Unknown User';
    return author.full_name || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
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

  const handleRSVP = () => {
    if (event && event.rsvp_link) {
      window.open(event.rsvp_link, '_blank');
    }
  };

  const addToCalendar = () => {
    if (!event) return;

    const startDate = new Date(event.start_time);
    const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    const formatCalendarDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;

    window.open(calendarUrl, '_blank');
  };

  // Early return if no event - MUST be after all hooks
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <DialogTitle className="font-headline text-xl">{event.title}</DialogTitle>
                {event.approval_status !== 'APPROVED' && (
                  <ApprovalStatusBadge status={event.approval_status} />
                )}
              </div>
              <DialogDescription className="text-base">
                {formatDate(event.start_time)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          {event.image_url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={getImageUrl(event.image_url)}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                {getInitials(getAuthorName(event.author))}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Organized by {getAuthorName(event.author)}</p>
              <p className="text-xs text-muted-foreground">
                Posted on {formatDateTime(event.created_at)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-4">
            {event.description && (
              <div>
                <h3 className="font-semibold mb-2">About This Event</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(event.start_time)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatTime(event.start_time)}
                    {event.end_time && ` - ${formatTime(event.end_time)}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {event.location || 'Location TBD'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {event.max_attendees && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Max {event.max_attendees} attendees
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* RSVP Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">RSVP to This Event</h3>
              {rsvpCounts.total > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {rsvpCounts.total} {rsvpCounts.total === 1 ? 'person' : 'people'}
                </Badge>
              )}
            </div>

            {/* RSVP Stats */}
            {rsvpCounts.total > 0 && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {rsvpCounts.going}
                  </div>
                  <div className="text-xs text-muted-foreground">Going</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {rsvpCounts.interested}
                  </div>
                  <div className="text-xs text-muted-foreground">Interested</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    {rsvpCounts.notGoing}
                  </div>
                  <div className="text-xs text-muted-foreground">Can't Go</div>
                </div>
              </div>
            )}

            {/* RSVP Buttons */}
            {event.approval_status === 'APPROVED' && (
              <div className="space-y-2">
                {!rsvpStatus ? (
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleRSVPAction('GOING')}
                      disabled={rsvpLoading}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Going
                    </Button>
                    <Button
                      onClick={() => handleRSVPAction('INTERESTED')}
                      disabled={rsvpLoading}
                      variant="outline"
                      size="sm"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Interested
                    </Button>
                    <Button
                      onClick={() => handleRSVPAction('NOT_GOING')}
                      disabled={rsvpLoading}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Can't Go
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                      <span className="text-sm font-medium">
                        You're {rsvpStatus === 'GOING' ? 'going' : rsvpStatus === 'INTERESTED' ? 'interested' : "can't go"}
                      </span>
                      <Button
                        onClick={handleCancelRSVP}
                        disabled={rsvpLoading}
                        variant="ghost"
                        size="sm"
                      >
                        Change
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {rsvpStatus !== 'GOING' && (
                        <Button
                          onClick={() => handleRSVPAction('GOING')}
                          disabled={rsvpLoading}
                          variant="outline"
                          size="sm"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Going
                        </Button>
                      )}
                      {rsvpStatus !== 'INTERESTED' && (
                        <Button
                          onClick={() => handleRSVPAction('INTERESTED')}
                          disabled={rsvpLoading}
                          variant="outline"
                          size="sm"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Interested
                        </Button>
                      )}
                      {rsvpStatus !== 'NOT_GOING' && (
                        <Button
                          onClick={() => handleRSVPAction('NOT_GOING')}
                          disabled={rsvpLoading}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Can't Go
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* External RSVP Link (if provided) */}
            {event.rsvp_link && (
              <Button
                onClick={() => window.open(event.rsvp_link, '_blank')}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                External RSVP Link
              </Button>
            )}

            {/* Add to Calendar */}
            <Button
              onClick={addToCalendar}
              variant="outline"
              className="w-full"
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
