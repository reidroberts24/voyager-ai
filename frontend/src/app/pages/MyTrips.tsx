import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TripCard } from '../components/trips/TripCard';
import { EmptyState } from '../components/trips/EmptyState';
import { NavigationBar } from '../components/layout/NavigationBar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { Footer } from '../components/layout/Footer';
import { OfflineIndicator } from '../components/common/OfflineIndicator';
import { TripCardSkeleton } from '../components/common/LoadingSkeleton';
import { Toaster } from 'sonner';

type FilterTab = 'all' | 'upcoming' | 'past' | 'drafts' | 'shared';

export default function MyTrips() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock trip data
  const allTrips = [
    {
      id: '1',
      title: '5 Days in Rome',
      destination: 'Rome, Italy',
      imageUrl: 'https://images.unsplash.com/photo-1757442745400-69f6f5c33726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwY29sb3NzZXVtJTIwY2l0eXxlbnwxfHx8fDE3NzEzMDIyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateRange: 'Jun 16-20, 2026',
      status: 'upcoming' as const,
      budget: 2400,
      days: 5,
      filter: 'upcoming',
    },
    {
      id: '2',
      title: 'Paris Weekend',
      destination: 'Paris, France',
      imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc3MTIzMTQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateRange: 'Mar 14-16, 2026',
      status: 'complete' as const,
      budget: 1800,
      days: 3,
      filter: 'past',
      collaborators: [
        { name: 'Sarah Johnson', initials: 'SJ' },
        { name: 'Mike Chen', initials: 'MC' },
      ],
    },
    {
      id: '3',
      title: 'Tokyo Adventure',
      destination: 'Tokyo, Japan',
      imageUrl: 'https://images.unsplash.com/photo-1648871647634-0c99b483cb63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc3MTMwMjI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateRange: 'Aug 5-12, 2026',
      status: 'planning' as const,
      budget: 3500,
      days: 8,
      filter: 'drafts',
    },
    {
      id: '4',
      title: 'Bali Retreat',
      destination: 'Bali, Indonesia',
      imageUrl: 'https://images.unsplash.com/photo-1698466632744-f79b37b88ffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwaW5kb25lc2lhJTIwYmVhY2h8ZW58MXx8fHwxNzcxMjMyODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateRange: 'Sep 1-10, 2026',
      status: 'upcoming' as const,
      budget: 2800,
      days: 10,
      filter: 'upcoming',
    },
    {
      id: '5',
      title: 'New York City',
      destination: 'New York, USA',
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzcxMjI4NjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateRange: 'Jan 10-15, 2026',
      status: 'complete' as const,
      budget: 2200,
      days: 6,
      filter: 'past',
    },
    {
      id: '6',
      title: 'London Explorer',
      destination: 'London, UK',
      imageUrl: 'https://images.unsplash.com/photo-1745016176874-cd3ed3f5bfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBiaWclMjBiZW58ZW58MXx8fHwxNzcxMjI3MjYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      dateRange: 'Jul 20-25, 2026',
      status: 'draft' as const,
      budget: 1900,
      days: 6,
      filter: 'drafts',
      collaborators: [
        { name: 'Emma Wilson', initials: 'EW' },
        { name: 'Tom Brown', initials: 'TB' },
        { name: 'Lisa Garcia', initials: 'LG' },
        { name: 'David Lee', initials: 'DL' },
      ],
    },
  ];

  // Filter trips
  const filteredTrips = allTrips.filter((trip) => {
    const matchesFilter = activeFilter === 'all' || trip.filter === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string) => {
    console.log('Delete trip:', id);
    // In a real app, this would call an API
  };

  const handleDuplicate = (id: string) => {
    console.log('Duplicate trip:', id);
    // In a real app, this would call an API
  };

  const handleShare = (id: string) => {
    console.log('Share trip:', id);
    // In a real app, this would open a share modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar isLoggedIn={true} notificationCount={3} />
      <OfflineIndicator />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium mb-2">My Trips</h1>
              <p className="text-gray-600">
                {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'}
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
              asChild
            >
              <Link to="/plan">
                <Plus className="size-5 mr-2" />
                Plan a New Trip
              </Link>
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'past', label: 'Past' },
              { id: 'drafts', label: 'Drafts' },
              { id: 'shared', label: 'Shared with me' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as FilterTab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Search trips by destination or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Trip Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                onDelete={() => handleDelete(trip.id)}
                onDuplicate={() => handleDuplicate(trip.id)}
                onShare={() => handleShare(trip.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
      
      <MobileBottomNav />
      
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