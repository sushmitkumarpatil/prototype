'use client';
import Link from "next/link";

export function PublicFooter() {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-primary/10 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <p className="text-xs text-muted-foreground">&copy; 2024 Ion-Alumni. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
                <Link href="#" className="text-xs text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors duration-300" prefetch={false}>
                    Terms of Service
                </Link>
                <Link href="#" className="text-xs text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors duration-300" prefetch={false}>
                    Privacy
                </Link>
            </nav>
        </footer>
    )
}
