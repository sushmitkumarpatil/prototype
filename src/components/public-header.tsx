'use client';
import Link from "next/link";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function PublicHeader() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background/95 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-50 shadow-lg">
      <Link href="/" className="flex items-center justify-center">
        <span className="font-headline text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Ion-Alumni</span>
      </Link>
      
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-md transition-all duration-300 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" asChild className="text-primary hover:text-primary/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 border border-primary/20 hover:border-primary/40 transition-all duration-300">
            <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-accent-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link href="/signup">Sign Up</Link>
        </Button>
      </nav>
    </header>
  );
}
