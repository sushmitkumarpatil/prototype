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
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  Building, 
  DollarSign,
  ExternalLink,
  Mail
} from 'lucide-react';
import { Job } from '@/lib/api/content';
import ApprovalStatusBadge from './approval-status-badge';

interface JobDetailsDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDetailsDialog({ job, open, onOpenChange }: JobDetailsDialogProps) {
  if (!job) return null;

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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = () => {
    if (job.apply_link_or_email.startsWith('http')) {
      window.open(job.apply_link_or_email, '_blank');
    } else {
      window.location.href = `mailto:${job.apply_link_or_email}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <DialogTitle className="font-headline text-xl">{job.title}</DialogTitle>
                {job.approval_status !== 'APPROVED' && (
                  <ApprovalStatusBadge status={job.approval_status} />
                )}
              </div>
              <DialogDescription className="text-base">
                {job.company_name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                {getInitials(getAuthorName(job.author))}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{getAuthorName(job.author)}</p>
              <p className="text-xs text-muted-foreground">
                Posted on {formatDate(job.created_at)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Job Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Job Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {/* Job Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {job.location || 'Location not specified'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{job.company_name}</span>
                </div>

                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.salary}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {job.work_mode || 'Work mode not specified'}
                  </span>
                </div>

                {job.job_type && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {job.job_type.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {job.experience_level && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.experience_level}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {job.job_type && (
                <Badge variant="secondary" className="text-xs">
                  {job.job_type.replace('_', ' ')}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {job.work_mode}
              </Badge>
              {job.experience_level && (
                <Badge variant="outline" className="text-xs">
                  {job.experience_level}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Apply Section */}
          <div className="space-y-3">
            <h3 className="font-semibold">Ready to Apply?</h3>
            <p className="text-sm text-muted-foreground">
              Click the button below to apply for this position. You'll be redirected to the application link or your email client will open.
            </p>
            <Button 
              onClick={handleApply}
              className="w-full"
              size="lg"
            >
              {job.apply_link_or_email.startsWith('http') ? (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Here
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Apply via Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
