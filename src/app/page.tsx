'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { events, jobs, users } from "@/lib/mock-data";
import { ArrowRight, Briefcase, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";

const JobCard = ({ job }: { job: (typeof jobs)[0] }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {job.location}
          </div>
          <div className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{job.type}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            <Link href="/login">View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const EventCard = ({ event }: { event: (typeof events)[0] }) => {
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
        <Button asChild variant="outline" size="sm">
            <Link href="/login">Details & RSVP</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


export default function LandingPage() {
    const featuredJobs = jobs.slice(0, 3);
    const upcomingEvents = events.slice(0, 3);
    const alumniCount = users.filter(u => u.role === 'alumnus').length;

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Connect. Grow. Succeed.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Welcome to Ion-Alumni, the exclusive portal for our college community. Reconnect with peers, discover opportunities, and give back to your alma mater.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                    <Link href="/signup">Join Now</Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/login">Member Login</Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Alumni collaborating"
                data-ai-hint="alumni collaborating"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <Users className="mx-auto h-12 w-12 text-primary" />
                        <h3 className="mt-2 text-3xl font-bold">{alumniCount}+</h3>
                        <p className="text-muted-foreground">Active Alumni</p>
                    </div>
                     <div className="text-center">
                        <Briefcase className="mx-auto h-12 w-12 text-primary" />
                        <h3 className="mt-2 text-3xl font-bold">{jobs.length}+</h3>
                        <p className="text-muted-foreground">Jobs Posted</p>
                    </div>
                     <div className="text-center">
                        <Calendar className="mx-auto h-12 w-12 text-primary" />
                        <h3 className="mt-2 text-3xl font-bold">{events.length}+</h3>
                        <p className="text-muted-foreground">Events Organized</p>
                    </div>
                     <div className="text-center">
                        <Users className="mx-auto h-12 w-12 text-primary" />
                        <h3 className="mt-2 text-3xl font-bold">100+</h3>
                        <p className="text-muted-foreground">Companies</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Featured Job Opportunities</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore exclusive job and internship openings by our esteemed alumni network.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {featuredJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Upcoming Events</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our upcoming events to network, learn, and reconnect with the community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
