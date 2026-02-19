import { Link } from 'react-router';
import { MapPin, Home, Plane } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="size-64 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1736117704460-549180eb1585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3N0JTIwdHJhdmVsZXIlMjBtYXAlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzcxMzAyODI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Lost traveler"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="size-24 text-blue-600 animate-bounce" />
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-8 left-1/4 size-12 bg-blue-200 rounded-full flex items-center justify-center animate-float">
            <Plane className="size-6 text-blue-600" />
          </div>
          <div className="absolute bottom-12 right-1/4 size-16 bg-purple-200 rounded-full flex items-center justify-center animate-float-delayed">
            <MapPin className="size-8 text-purple-600" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-medium text-gray-900 mb-2">
            Oops! You've wandered off the map
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back on track to your next adventure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            asChild
          >
            <Link to="/">
              <Home className="size-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
          >
            <Link to="/plan">
              <Plane className="size-5 mr-2" />
              Plan a Trip
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Or explore these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/trips" className="text-blue-600 hover:underline">
              My Trips
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/explore" className="text-blue-600 hover:underline">
              Explore Destinations
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/profile" className="text-blue-600 hover:underline">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
