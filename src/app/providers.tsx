'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NProgressProvider } from '@/components/nprogress-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { MessagingProvider } from '@/contexts/MessagingContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SocketProvider } from '@/contexts/SocketContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <SocketProvider>
            <MessagingProvider>
              <NotificationProvider>
                <NProgressProvider>{children}</NProgressProvider>
                <Toaster />
              </NotificationProvider>
            </MessagingProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
