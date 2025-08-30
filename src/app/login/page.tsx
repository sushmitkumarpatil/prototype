'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome } from 'lucide-react';
import Link from '@/components/ui/link';
import AuthLayout from '@/components/auth-layout';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have authentication logic here.
    // For now, we'll just redirect to the dashboard.
    router.push('/dashboard');
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
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Chrome className="mr-2 h-4 w-4" />
            Login with Google
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}   