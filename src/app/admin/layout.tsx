'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
  CheckCircle,
  FileText,
  Briefcase,
  Calendar,
  BarChart3,
  Search,
  Menu,
  X,
} from 'lucide-react';
import Link from '@/components/ui/link';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If this is the login page, render children without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'Users',
    },
    {
      href: '/admin/approvals',
      icon: CheckCircle,
      label: 'Approvals',
    },
    {
      href: '/admin/content',
      icon: FileText,
      label: 'Content',
    },
    {
      href: '/admin/jobs',
      icon: Briefcase,
      label: 'Jobs',
    },
    {
      href: '/admin/events',
      icon: Calendar,
      label: 'Events',
    },
    {
      href: '/admin/posts',
      icon: FileText,
      label: 'Posts',
    },
    {
      href: '/admin/reports',
      icon: BarChart3,
      label: 'Reports',
    },
  ];

  // Don't render layout until mounted and user is authenticated admin
  const isAdmin = user && (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN');
  if (!mounted || !isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="w-72 bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl flex-shrink-0 hidden lg:flex">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg">
                <ShieldCheck className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="px-3 py-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </h2>
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {user && (
              <div className="mb-4 p-3 rounded-lg bg-muted border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.full_name || 'Admin User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Tenant Admin'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border shadow-xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
                      <ShieldCheck className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                      <p className="text-sm text-muted-foreground">Management Dashboard</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                <div className="px-3 py-2">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Navigation
                  </h2>
                </div>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'text-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-border">
                {user && (
                  <div className="mb-4 p-3 rounded-lg bg-muted border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.full_name || 'Admin User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Tenant Admin'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="bg-card/95 backdrop-blur-xl border-b border-border px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {menuItems.find(item => pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)))?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your platform efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-input rounded-xl bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-success to-success/80 text-success-foreground rounded-xl shadow-lg">
                <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-background/50 via-primary/5 to-accent/5 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
