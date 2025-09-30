'use client';
import { NewEventDialog, NewJobDialog, NewPostDialog } from '@/components/new-content-dialogs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import Link from '@/components/ui/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { currentUser } from '@/lib/mock-data';
import {
  Bell,
  Briefcase,
  Calendar,
  Edit,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Search,
  Sun,
  UserCircle,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';



export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

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
        className="border-r border-sidebar-border/50 transition-all duration-500 ease-out bg-gradient-to-b from-sidebar-background via-sidebar-background/98 to-sidebar-background/95 backdrop-blur-sm shadow-xl"
      >
        <SidebarHeader className="bg-gradient-to-r from-sidebar-primary/5 to-sidebar-accent/5 border-b border-sidebar-border/30 backdrop-blur-sm">
          <Link href="/dashboard" className="flex items-center gap-3 p-6 hover:bg-sidebar-accent/5 rounded-lg mx-2 mt-2 transition-all duration-300 ease-out">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center text-white font-bold text-sm shadow-lg">
              IA
            </div>
            <span className="font-headline text-xl font-bold transition-all duration-500 ease-out group-data-[collapsible=icon]:-translate-x-4 group-data-[collapsible=icon]:opacity-0 bg-gradient-to-r from-sidebar-primary to-sidebar-accent bg-clip-text text-transparent">
              Ion-Alumni
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                Navigation
              </h2>
            </div>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard'}
                  tooltip={{ children: 'Dashboard' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/profile'}
                  tooltip={{ children: 'My Profile' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <UserCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/alumni'}
                  tooltip={{ children: 'Find Alumni' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/alumni" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <Users className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">Find Alumni</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          {/* Content Section */}
          <div className="space-y-1 mt-6">
            <div className="px-3 py-2">
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                Content
              </h2>
            </div>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/jobs')}
                  tooltip={{ children: 'Jobs' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/jobs" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <Briefcase className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">Jobs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/events')}
                  tooltip={{ children: 'Events' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/events" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <Calendar className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/posts')}
                  tooltip={{ children: 'Posts' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/posts" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          {/* Communication Section */}
          <div className="space-y-1 mt-6">
            <div className="px-3 py-2">
              <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                Communication
              </h2>
            </div>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/messages'}
                  tooltip={{ children: 'Messages' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/messages" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <MessageSquare className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/notifications'}
                  tooltip={{ children: 'Notifications' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/notifications" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <div className="relative flex-shrink-0">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-[1.25rem] group-data-[collapsible=icon]:scale-75 animate-pulse"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </div>
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">
                      Notifications
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/history'}
                  tooltip={{ children: 'History' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/10 hover:to-sidebar-primary/10 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/20 data-[active=true]:to-sidebar-accent/20 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-lg data-[active=true]:border data-[active=true]:border-sidebar-primary/20 transition-all duration-300 ease-out"
                >
                  <Link href="/history" className="flex items-center gap-3 px-3 py-2.5">
                    <Edit className="h-5 w-5" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/30 bg-gradient-to-r from-sidebar-accent/5 to-sidebar-primary/5 backdrop-blur-sm p-4">
          <div className="space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-sidebar-accent/5 group-data-[collapsible=icon]:justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center text-white text-sm font-semibold">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: 'Logout' }}
                  className="mx-1 rounded-xl text-sidebar-foreground hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 hover:text-red-600 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-out"
                >
                  <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:justify-center">
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="transition-all duration-300 ease-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 font-medium">Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
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
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await logout();
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                      }}
                      className="text-popover-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
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