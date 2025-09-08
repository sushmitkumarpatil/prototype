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
  useSidebar,
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
  Sun,
  UserCircle,
  Users,
  PanelLeft,
  PanelLeftClose,
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
import Link from '@/components/ui/link';
import { currentUser } from '@/lib/mock-data';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { NewEventDialog, NewJobDialog, NewPostDialog } from '@/components/new-content-dialogs';



export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  }

  // Enhanced Sidebar Toggle Button Component
  function EnhancedSidebarToggle() {
    const { state, toggleSidebar } = useSidebar();
    
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-10 w-10 rounded-lg transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:scale-105 active:scale-95 sidebar-focus-ring text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40"
        title={state === 'expanded' ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        <div className="relative h-5 w-5 sidebar-toggle-icon">
          <PanelLeft 
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              state === 'expanded' 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 rotate-90 scale-75'
            }`}
          />
          <PanelLeftClose 
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              state === 'expanded' 
                ? 'opacity-0 -rotate-90 scale-75' 
                : 'opacity-100 rotate-0 scale-100'
            }`}
          />
        </div>
        <span className="sr-only">
          {state === 'expanded' ? 'Collapse Sidebar' : 'Expand Sidebar'}
        </span>
      </Button>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border transition-all duration-500 ease-out bg-gradient-to-b from-sidebar-background to-sidebar-background/95"
      >
        <SidebarHeader className="bg-gradient-to-r from-sidebar-primary/10 to-sidebar-accent/10 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2 p-4">
            <span className="font-headline text-xl font-bold transition-all duration-500 ease-out group-data-[collapsible=icon]:-translate-x-4 group-data-[collapsible=icon]:opacity-0 bg-gradient-to-r from-sidebar-primary to-sidebar-accent bg-clip-text text-transparent">
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
                className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-primary/20 hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/90 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg"
              >
                                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2">Dashboard</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/profile'}
                tooltip={{ children: 'My Profile' }}
                className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-primary/20 hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/90 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg"
              >
                                  <Link href="/profile">
                    <UserCircle />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2">My Profile</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/alumni'}
                tooltip={{ children: 'Find Alumni' }}
                className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-primary/20 hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/90 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg"
              >
                                  <Link href="/alumni">
                    <Users />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2">Find Alumni</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/jobs')}
                tooltip={{ children: 'Jobs' }}
                className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-primary/20 hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/90 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg"
              >
                                  <Link href="/jobs">
                    <Briefcase />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2">Jobs</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/events')}
                tooltip={{ children: 'Events' }}
                className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-primary/20 hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/90 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg"
              >
                                  <Link href="/events">
                    <Calendar />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2">Events</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/messages'}
                tooltip={{ children: 'Messages' }}
                className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-primary/20 hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/90 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg"
              >
                                  <Link href="/messages">
                    <MessageSquare />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2">Messages</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border bg-gradient-to-r from-sidebar-accent/10 to-sidebar-primary/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'Logout' }} className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/20 hover:to-sidebar-primary/20 hover:text-sidebar-accent-foreground">
                                  <Link href="/login">
                    <LogOut />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2">Logout</span>
                  </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{
         <div className="flex h-full flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6 transition-all duration-300 ease-out shadow-lg border-primary/10">
                {/* Mobile Sidebar Trigger */}
                <SidebarTrigger className="flex md:hidden text-primary hover:text-primary/80" />
                
                {/* Desktop Enhanced Sidebar Toggle */}
                <div className="hidden md:flex">
                  <EnhancedSidebarToggle />
                </div>
                
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-200" />
                  <Input placeholder="Search alumni, jobs, events..." className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px] transition-all duration-300 ease-out focus:ring-2 focus:ring-primary/20 border-primary/20 hover:border-primary/40 focus:border-primary" />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full transition-all duration-200 ease-out hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:scale-105 text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-all duration-200 ease-out hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:scale-105 text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40">
                       <Avatar className="h-9 w-9">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">{getInitials(currentUser.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-primary/20">
                    <DropdownMenuLabel className="text-popover-foreground">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem asChild className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary"><Link href="/profile">Profile</Link></DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Toggle theme</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-popover border-primary/20">
                          <DropdownMenuItem onClick={() => setTheme("light")} className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary">
                            Light
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")} className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary">
                            Dark
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("system")} className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary">
                            System
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem asChild className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary"><Link href="/login">Logout</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300 ease-out bg-gradient-to-br from-background via-primary/5 to-accent/5">{children}</main>
            {currentUser.role === 'alumnus' && (
              <div className="fixed bottom-6 right-6 z-50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-14 w-14 rounded-full bg-gradient-to-r from-accent to-primary shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-110 active:scale-95 text-accent-foreground border border-accent/20 hover:border-accent/40" size="icon">
                      <Plus className="h-6 w-6" />
                      <span className="sr-only">Create New</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="top" className="w-56 bg-popover border-primary/20">
                    <DropdownMenuLabel className="text-popover-foreground">Create New</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuGroup>
                      <NewPostDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Post</span>
                        </DropdownMenuItem>
                      </NewPostDialog>
                       <NewJobDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary">
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Job</span>
                        </DropdownMenuItem>
                      </NewJobDialog>
                      <NewEventDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary">
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