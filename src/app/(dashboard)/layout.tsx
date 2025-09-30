import { DashboardLayoutClient } from './layout-client';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </NotificationProvider>
  );
}
