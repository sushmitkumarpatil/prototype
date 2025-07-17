'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobs, getAuthor, currentUser } from "@/lib/mock-data";
import { Briefcase, MapPin, PlusCircle, Search } from "lucide-react";

const JobCard = ({ job }: { job: (typeof jobs)[0] }) => {
  const author = getAuthor(job.authorId);
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
        <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {job.location}
          </div>
          <div className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{job.type}</div>
        </div>
        <Button className="w-full">View Details & Apply</Button>
      </CardFooter>
    </Card>
  )
}

export default function JobsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Job & Internship Board</h1>
          <p className="text-muted-foreground">Discover opportunities posted by alumni.</p>
        </div>
        {currentUser.role === 'alumnus' && (
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by title, company..." className="pl-9" />
                </div>
                <Select>
                    <SelectTrigger><SelectValue placeholder="Filter by Course" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="mech">Mechanical Engineering</SelectItem>
                        <SelectItem value="ec">Electronics & Communication</SelectItem>
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger><SelectValue placeholder="Filter by Job Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                    </SelectContent>
                </Select>
                <Button>Apply Filters</Button>
           </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
}
