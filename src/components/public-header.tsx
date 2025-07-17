'use client';
import Link from "next/link";
import { Button } from "./ui/button";

export function PublicHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-center">
        <span className="font-headline text-xl font-bold text-primary">Ion-Alumni</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/signup">Sign Up</Link>
        </Button>
      </nav>
    </header>
  );
}
