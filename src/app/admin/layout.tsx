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
  ShieldCheck,
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
import Link from '@/components/ui/link';
import { currentUser } from '@/lib/mock-data';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';


export default function AdminLayout({
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
        className="border-r border-sidebar-border bg-card"
      >
        <SidebarHeader>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
             <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold transition-all duration-300 group-data-[collapsible=icon]:-translate-x-4 group-data-[collapsible=icon]:opacity-0">
              Admin Panel
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/dashboard'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/admin/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/users')}
                tooltip={{ children: 'User Management' }}
              >
                <Link href="/admin/users">
                  <Users />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/content')}
                tooltip={{ children: 'Content Moderation' }}
              >
                <Link href="/admin/content">
                  <FileText />
                  <span>Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/reports')}
                tooltip={{ children: 'Reports' }}
              >
                <Link href="/admin/reports">
                  <Bell />
                  <span>Reports</span>
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
                <Link href="/admin/login">
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
                  <Input placeholder="Search users, content..." className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                       <Avatar className="h-9 w-9">
                        <AvatarImage src={currentUser.avatar} alt="Admin" />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
                    <DropdownMenuItem asChild><Link href="/admin/login">Logout</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      }</SidebarInset>
    </SidebarProvider>
  );
}
