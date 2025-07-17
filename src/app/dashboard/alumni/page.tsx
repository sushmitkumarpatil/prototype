'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users } from "@/lib/mock-data";
import { Building, Linkedin, MessageSquare, Search } from "lucide-react";

const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
}

const AlumniCard = ({ user }: { user: (typeof users)[0] }) => {
  return (
    <Card className="text-center">
      <CardContent className="p-6">
        <Avatar className="mx-auto h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <h3 className="mt-4 font-headline text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.jobTitle}</p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Building className="h-3 w-3" />
            {user.company}
        </p>
        <Badge variant="outline" className="mt-2">Batch of {user.batch}</Badge>
        <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm"><MessageSquare className="mr-2 h-4 w-4" />Message</Button>
            <Button variant="ghost" size="icon" asChild>
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5" /></a>
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AlumniPage() {
  const alumni = users.filter(u => u.role === 'alumnus');

  return (
     <div className="container mx-auto">
      <div className="mb-6 flex flex-col items-start gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Find Alumni</h1>
          <p className="text-muted-foreground">Network with experienced professionals from your college.</p>
        </div>
      </div>

       <Card className="mb-6">
        <CardContent className="p-4">
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name, company..." className="pl-9" />
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
                    <SelectTrigger><SelectValue placeholder="Filter by Batch" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2015">2015</SelectItem>
                        <SelectItem value="2012">2012</SelectItem>
                        <SelectItem value="2018">2018</SelectItem>
                    </SelectContent>
                </Select>
                <Button>Apply Filters</Button>
           </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {alumni.map(user => <AlumniCard key={user.id} user={user} />)}
      </div>
    </div>
  );
}
