'use client';

export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from '@/components/ui/link';
import EnhancedAuthLayout from '@/components/enhanced-auth-layout';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN') &&
      typeof window !== 'undefined' &&
      window.location.pathname === '/admin/login'
    ) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password, '/admin/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid admin credentials',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EnhancedAuthLayout
      title="Admin Portal"
      description="Sign in to manage users, approvals, jobs, events, and posts."
      footerText="Return to main site?"
      footerLink="/"
      footerLinkText="Go back"
      isLoginPage
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email" className="text-card-foreground font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password" className="text-card-foreground font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in to Admin Panel'}
          </Button>
        </div>
      </form>
    </EnhancedAuthLayout>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
