'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { NProgressProvider } from '@/components/nprogress-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NProgressProvider>{children}</NProgressProvider>
      <Toaster />
    </ThemeProvider>
  );
}
