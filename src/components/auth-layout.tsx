'use client';

import type {ReactNode} from 'react';

export function AuthLayout({children}: {children: ReactNode}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
            <img src="/logo.png" alt="Ion-Alumni Logo" className="h-10 w-10" />
            <h1 className="font-headline text-3xl font-bold">Ion-Alumni</h1>
          </div>
          <p className="text-muted-foreground">
            Fostering connections between students and alumni.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
