'use client';

import Link from 'next/link';
import type {ReactNode} from 'react';

export function AuthLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center gap-3 text-2xl font-bold text-primary">
            <h1 className="font-headline text-3xl font-bold">Ion-Alumni</h1>
          </Link>
          <h2 className="font-headline text-2xl">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
