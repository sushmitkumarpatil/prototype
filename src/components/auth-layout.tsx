import type { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-primary">
            <GraduationCap className="h-8 w-8" />
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
