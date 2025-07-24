'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Bell,
  Briefcase,
  Calendar,
  ChevronDown,
  Edit,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  UserCircle,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { currentUser } from '@/lib/mock-data';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const NewPostDialog = ({ children }: { children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create a New Post</DialogTitle>
        <DialogDescription>
          Share your thoughts, experiences, or announcements with the community.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="post-title" className="text-right">
            Title
          </Label>
          <Input id="post-title" placeholder="(Optional) e.g. Advice for Aspiring PMs" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="post-content" className="text-right pt-2">
            Content
          </Label>
          <Textarea id="post-content" placeholder="What's on your mind?" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-accent hover:bg-accent/90">Post</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const NewJobDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Post a New Job</DialogTitle>
        <DialogDescription>
          Fill in the details below to post a new job opportunity for students and fellow alumni.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="job-title" className="text-right">
            Job Title
          </Label>
          <Input id="job-title" placeholder="e.g. Frontend Developer" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="company" className="text-right">
            Company
          </Label>
          <Input id="company" placeholder="e.g. Innovate Corp" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <Input id="location" placeholder="e.g. Remote or Mumbai" className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="job-type" className="text-right">
            Job Type
          </Label>
            <Select>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select job type" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">
            Description
          </Label>
          <Textarea id="description" placeholder="Job responsibilities, qualifications, etc." className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-accent hover:bg-accent/90">Post Job</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

const NewEventDialog = ({ children }: { children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Announce a New Event</DialogTitle>
        <DialogDescription>
          Fill in the details below to announce a new event to the community.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-title" className="text-right">
            Title
          </Label>
          <Input id="event-title" placeholder="e.g. Alumni Networking Meetup" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-date" className="text-right">
            Date
          </Label>
          <Input id="event-date" type="date" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-location" className="text-right">
            Location
          </Label>
          <Input id="event-location" placeholder="e.g. Online or College Auditorium" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="event-description" className="text-right pt-2">
            Description
          </Label>
          <Textarea id="event-description" placeholder="Describe the event..." className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-accent hover:bg-accent/90">Announce Event</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  }

  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border"
      >
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-headline text-xl font-bold transition-all duration-300 group-data-[collapsible=icon]:-translate-x-4 group-data-[collapsible=icon]:opacity-0">
              Ion-Alumni
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/profile'}
                tooltip={{ children: 'My Profile' }}
              >
                <Link href="/dashboard/profile">
                  <UserCircle />
                  <span>My Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/alumni'}
                tooltip={{ children: 'Find Alumni' }}
              >
                <Link href="/dashboard/alumni">
                  <Users />
                  <span>Find Alumni</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard/jobs')}
                tooltip={{ children: 'Jobs' }}
              >
                <Link href="/dashboard/jobs">
                  <Briefcase />
                  <span>Jobs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard/events')}
                tooltip={{ children: 'Events' }}
              >
                <Link href="/dashboard/events">
                  <Calendar />
                  <span>Events</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/messages'}
                tooltip={{ children: 'Messages' }}
              >
                <Link href="/dashboard/messages">
                  <MessageSquare />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={{ children: 'Settings' }}>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'Logout' }}>
                <Link href="/login">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{
         <div className="flex h-full flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
                <SidebarTrigger className="flex md:hidden" />
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search alumni, jobs, events..." className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]" />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                       <Avatar className="h-9 w-9">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Toggle theme</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/login">Logout</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="relative flex-1 overflow-auto p-4 md:p-6">{children}</main>
            {currentUser.role === 'alumnus' && (
              <div className="absolute bottom-6 right-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-14 w-14 rounded-full bg-accent shadow-lg hover:bg-accent/90" size="icon">
                      <Plus className="h-6 w-6" />
                      <span className="sr-only">Create New</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="top" className="w-56">
                    <DropdownMenuLabel>Create New</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <NewPostDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Post</span>
                        </DropdownMenuItem>
                      </NewPostDialog>
                       <NewJobDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Job</span>
                        </DropdownMenuItem>
                      </NewJobDialog>
                      <NewEventDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Event</span>
                        </DropdownMenuItem>
                      </NewEventDialog>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
        </div>
      }</SidebarInset>
    </SidebarProvider>
  );
}
