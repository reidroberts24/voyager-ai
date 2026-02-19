import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-orange-600 text-white py-2 px-4 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <WifiOff className="size-5" />
        <span className="text-sm font-medium">
          You're offline. Some features may be unavailable.
        </span>
      </div>
    </div>
  );
}
