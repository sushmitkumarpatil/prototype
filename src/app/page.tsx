'use client';

export const dynamic = 'force-dynamic';

import AnimatedSection from "@/components/animated-section";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event, getEvents, getJobs, Job } from "@/lib/api/content";
import { users } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Calendar, ChevronDown, MapPin, Shield, User, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';

const JobCard = ({ job }: { job: Job }) => {
  return (
    <Card className="flex flex-col border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card group">
      <CardHeader>
        <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                <Briefcase className="h-6 w-6 text-primary group-hover:text-primary/80" />
            </div>
            <div>
                <CardTitle className="font-headline text-lg text-card-foreground group-hover:text-primary transition-colors duration-300">{job.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{job.company_name}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary/70" /> {job.location}
          </div>
          <div className="rounded-md bg-gradient-to-r from-primary/10 to-accent/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20">
            {job.job_type ? job.job_type.replace('_', ' ') : job.work_mode}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <Link href="/login">View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const EventCard = ({ event }: { event: Event }) => {
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
    <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card group">
      <CardHeader className="p-0">
        {event.image_url ? (
          <img src={getImageUrl(event.image_url)} alt={event.title} className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-primary/60" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-accent">{new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h3 className="font-headline text-lg font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-4 w-4 text-primary/70" /> {event.location}
        </div>
        <Button asChild variant="outline" size="sm" className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-card-foreground hover:text-primary transition-all duration-300">
            <Link href="/login">Details & RSVP</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


export default function LandingPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    
    const featuredJobs = jobs.slice(0, 3);
    const upcomingEvents = events.slice(0, 3);
    const alumniCount = users.filter(u => u.role === 'alumnus').length;

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load jobs and events without authentication for public display
                const [jobsResponse, eventsResponse] = await Promise.allSettled([
                    getJobs(1, 6).catch(() => ({ success: false, jobs: [] })),
                    getEvents(1, 6).catch(() => ({ success: false, events: [] }))
                ]);

                if (jobsResponse.status === 'fulfilled' && jobsResponse.value.success) {
                    setJobs(jobsResponse.value.jobs || []);
                }

                if (eventsResponse.status === 'fulfilled' && eventsResponse.value.success) {
                    setEvents(eventsResponse.value.events || []);
                }
            } catch (error) {
                console.error('Error loading landing page data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <AnimatedSection className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-accent/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-2">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                      Connect. Grow. Succeed.
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Welcome to Ion-Alumni, the exclusive portal for our college community. Reconnect with peers, discover opportunities, and give back to your alma mater.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                >
                  <Button asChild size="lg" className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Link href="/signup">Join Now</Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="lg" variant="secondary" className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-card-foreground hover:text-primary transition-all duration-300">
                        Member Login
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="flex items-center w-full">
                          <User className="mr-2 h-4 w-4" />
                          User Login
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/login" className="flex items-center w-full">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Login
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              </div>
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Alumni collaborating"
                data-ai-hint="alumni collaborating"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-center p-6 bg-card rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-2 text-3xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">{alumniCount}+</h3>
                        <p className="text-muted-foreground">Active Alumni</p>
                    </motion.div>
                     <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center p-6 bg-card rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-2 text-3xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">{jobs.length || '0'}+</h3>
                        <p className="text-muted-foreground">Jobs Posted</p>
                    </motion.div>
                     <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center p-6 bg-card rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-2 text-3xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">{events.length || '0'}+</h3>
                        <p className="text-muted-foreground">Events Organized</p>
                    </motion.div>
                     <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-center p-6 bg-card rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-2 text-3xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">100+</h3>
                        <p className="text-muted-foreground">Companies</p>
                    </motion.div>
                </div>
            </div>
        </AnimatedSection>

        {/* Featured Jobs Section */}
        <AnimatedSection className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Featured Job Opportunities</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore exclusive job and internship openings by our esteemed alumni network.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                      <Card className="flex flex-col border-border bg-card">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 bg-muted rounded-lg animate-pulse"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="h-3 bg-muted rounded animate-pulse"></div>
                        </CardContent>
                        <CardFooter>
                          <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : featuredJobs.length > 0 ? (
                  featuredJobs.map((job, i) => (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                      <JobCard job={job} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No jobs available at the moment. Check back soon!</p>
                  </div>
                )}
            </div>
          </div>
        </AnimatedSection>

        {/* Upcoming Events Section */}
        <AnimatedSection className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Upcoming Events</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our upcoming events to network, learn, and reconnect with the community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                      <Card className="overflow-hidden border-border bg-card">
                        <CardHeader className="p-0">
                          <div className="aspect-video w-full bg-muted animate-pulse"></div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="h-3 bg-muted rounded w-1/3 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded animate-pulse"></div>
                            <div className="h-3 bg-muted rounded animate-pulse"></div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-4 pt-0">
                          <div className="h-3 bg-muted rounded w-1/3 animate-pulse"></div>
                          <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, i) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                      <EventCard event={event} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
                  </div>
                )}
            </div>
          </div>
        </AnimatedSection>
      </main>
      <PublicFooter />
    </div>
  );
}
