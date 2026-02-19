import { Link, useLocation } from 'react-router';
import { Home, Plus, Briefcase, Compass, User } from 'lucide-react';

export function MobileBottomNav() {
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'plan', label: 'Plan', icon: Plus, path: '/plan' },
    { id: 'trips', label: 'My Trips', icon: Briefcase, path: '/trips' },
    { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className={`size-6 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
              <span className={`text-xs ${isActive ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
