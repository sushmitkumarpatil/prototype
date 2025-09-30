'use client';

import { useState } from 'react';
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
  CalendarPlus
} from 'lucide-react';
import { Event } from '@/lib/api/content';
import ApprovalStatusBadge from './approval-status-badge';

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({ event, open, onOpenChange }: EventDetailsDialogProps) {
  if (!event) return null;

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
    if (event.rsvp_link) {
      window.open(event.rsvp_link, '_blank');
    }
  };

  const addToCalendar = () => {
    const startDate = new Date(event.start_time);
    const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
    
    const formatCalendarDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;
    
    window.open(calendarUrl, '_blank');
  };

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

          {/* Action Buttons */}
          <div className="space-y-3">
            <h3 className="font-semibold">Join This Event</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={addToCalendar}
                variant="outline"
                className="flex-1"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              
              {event.rsvp_link && (
                <Button 
                  onClick={handleRSVP}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  RSVP Now
                </Button>
              )}
            </div>
            
            {!event.rsvp_link && (
              <p className="text-xs text-muted-foreground text-center">
                RSVP link not available yet. Check back later or contact the organizer.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
