'use client';

export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from '@/components/ui/link';
import AuthLayout from '@/components/auth-layout';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Redirect if already authenticated, but only if on /login to avoid double navigation
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined' && window.location.pathname === '/login') {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, redirectTo);
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Enter your credentials to access your account."
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Sign up"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email" className="text-card-foreground font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300"
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-card-foreground font-medium">Password</Label>
              <Link
                href="#"
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all duration-300"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}