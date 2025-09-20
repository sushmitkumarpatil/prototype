'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, MapPin, Search, Plus } from "lucide-react";
import { NewJobDialog } from "@/components/new-content-dialogs";
import ApprovalStatusBadge from "@/components/approval-status-badge";
import { getJobs, Job } from "@/lib/api/content";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const JobCard = ({ job }: { job: Job }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
              {job.approval_status !== 'APPROVED' && (
                <ApprovalStatusBadge status={job.approval_status} />
              )}
            </div>
            <CardDescription>{job.company_name}</CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                  {getInitials(job.author.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                Posted by {job.author.full_name} • {formatDate(job.created_at)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {job.location || 'Location not specified'}
          </div>
          <div className="flex gap-2">
            {job.job_type && (
              <Badge variant="secondary" className="text-xs">
                {job.job_type.replace('_', ' ')}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {job.work_mode}
            </Badge>
          </div>
        </div>
        <Button className="w-full" onClick={() => {
          if (job.apply_link_or_email.startsWith('http')) {
            window.open(job.apply_link_or_email, '_blank');
          } else {
            window.location.href = `mailto:${job.apply_link_or_email}`;
          }
        }}>
          View Details & Apply
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function JobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs(1, 50); // Load more jobs initially
      if (response.success) {
        // Handle response structure - jobs should be in response.data.jobs
        const jobsData = response.data?.jobs || [];
        // Filter out any undefined/null items
        const validJobs = jobsData.filter((job: any) => job && job.id);
        setJobs(validJobs);
      } else {
        throw new Error('Failed to load jobs');
      }
    } catch (error: any) {
      console.error('Load jobs error:', error);
      
      // Don't show error toast for authentication errors
      if (!error.message?.includes('Session expired') && !error.message?.includes('401')) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load jobs',
          variant: 'destructive',
        });
      }
      
      // Set empty array on error to prevent undefined map errors
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // This could be enhanced to make API calls with filters
    // For now, we'll filter client-side
  };

  const filteredJobs = jobs.filter(job => {
    // Safety check to ensure job exists and has required properties
    if (!job || !job.id) return false;
    
    const matchesSearch = !searchQuery || 
      (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesJobType = !jobTypeFilter || jobTypeFilter === 'all' || job.job_type === jobTypeFilter;
    const matchesWorkMode = !workModeFilter || workModeFilter === 'all' || job.work_mode === workModeFilter;
    
    return matchesSearch && matchesJobType && matchesWorkMode;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Job & Internship Board</h1>
          <p className="text-muted-foreground">Discover opportunities posted by alumni.</p>
        </div>
        <NewJobDialog onCreated={(job) => {
          setJobs((prev) => [job, ...prev]);
        }}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </NewJobDialog>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, company..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={workModeFilter} onValueChange={setWorkModeFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Work Mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Modes</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Onsite">Onsite</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Job Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {searchQuery || jobTypeFilter || workModeFilter 
                    ? 'No jobs found matching your filters.' 
                    : 'No jobs posted yet. Be the first to share an opportunity!'
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredJobs.map(job => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
}
