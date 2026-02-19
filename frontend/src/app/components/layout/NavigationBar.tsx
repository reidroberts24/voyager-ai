import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X, Plane, Bell, User, Settings, LogOut, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavigationBarProps {
  isLoggedIn?: boolean;
  notificationCount?: number;
}

export function NavigationBar({ isLoggedIn = false, notificationCount = 0 }: NavigationBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    console.log('Signing out...');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Plane className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Voyager AI
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link to="/plan">Plan a Trip</Link>
            </Button>
            <Link to="/trips" className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors">
              My Trips
            </Link>
            <Link to="/explore" className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors">
              Explore
            </Link>
          </div>

          {/* Desktop Auth - Right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="size-5 text-gray-700" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-600 text-white size-5 flex items-center justify-center p-0 text-xs">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Badge>
                  )}
                </button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="size-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium cursor-pointer hover:opacity-90 transition-opacity">
                    JD
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <User className="size-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <Settings className="size-4 mr-2" />
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/trips')} className="cursor-pointer">
                      <Briefcase className="size-4 mr-2" />
                      My Trips
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                      <LogOut className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button and avatar */}
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn && (
              <Link to="/profile">
                <div className="size-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
              </Link>
            )}
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-200">
            <Link to="/plan" className="block py-2 text-gray-700 hover:text-gray-900">
              Plan a Trip
            </Link>
            <Link to="/trips" className="block py-2 text-gray-700 hover:text-gray-900">
              My Trips
            </Link>
            <Link to="/explore" className="block py-2 text-gray-700 hover:text-gray-900">
              Explore
            </Link>
            <div className="pt-3 space-y-2">
              {isLoggedIn ? (
                <Link to="/profile" className="flex items-center gap-3 py-2">
                  <div className="size-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <span>John Doe</span>
                </Link>
              ) : (
                <>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}