import { ReactNode } from 'react';
import { NavigationBar } from './NavigationBar';
import { MobileBottomNav } from './MobileBottomNav';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { Toaster } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  notificationCount?: number;
  showMobileNav?: boolean;
}

export function AppLayout({ 
  children, 
  isLoggedIn = false, 
  notificationCount = 0,
  showMobileNav = true 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar isLoggedIn={isLoggedIn} notificationCount={notificationCount} />
      <OfflineIndicator />
      
      <main className={showMobileNav ? 'pb-16 md:pb-0' : ''}>
        {children}
      </main>
      
      {showMobileNav && <MobileBottomNav />}
      
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: 'bg-white border border-gray-200 shadow-lg',
            title: 'text-gray-900',
            description: 'text-gray-600',
            success: 'border-green-600',
            error: 'border-red-600',
            info: 'border-blue-600',
          },
        }}
      />
    </div>
  );
}
