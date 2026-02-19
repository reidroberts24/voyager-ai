import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavigationBar } from '../components/layout/NavigationBar';
import { Footer } from '../components/layout/Footer';
import { Input } from '../components/ui/input';
import { DestinationCard } from '../components/explore/DestinationCard';
import { FeaturedTripCard } from '../components/explore/FeaturedTripCard';
import { Button } from '../components/ui/button';

type TripCategory = 'popular' | 'budget' | 'luxury' | 'family' | 'solo' | 'adventure' | 'culture' | 'beach';
type Region = 'all' | 'europe' | 'asia' | 'americas' | 'africa' | 'oceania' | 'middle-east';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TripCategory>('popular');
  const [activeRegion, setActiveRegion] = useState<Region>('all');

  // Mock destinations data
  const destinations = [
    {
      id: 1,
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1656504862966-2f0d002bae4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjBzdW5zZXR8ZW58MXx8fHwxNzcxMjc5MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 142,
      costRange: '$2,000-3,500',
      bestMonths: 'Apr-Oct',
      region: 'Europe',
      regionKey: 'europe' as Region,
    },
    {
      id: 2,
      name: 'Kyoto',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1729864881494-d96345092845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMGphcGFuJTIwdGVtcGxlfGVufDF8fHx8MTc3MTI0MTc5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 98,
      costRange: '$2,500-4,000',
      bestMonths: 'Mar-May, Oct-Nov',
      region: 'Asia',
      regionKey: 'asia' as Region,
    },
    {
      id: 3,
      name: 'Reykjavik',
      country: 'Iceland',
      image: 'https://images.unsplash.com/photo-1671273257845-a6032cdbec6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VsYW5kJTIwbGFuZHNjYXBlJTIwd2F0ZXJmYWxsfGVufDF8fHx8MTc3MTMwMjU3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 76,
      costRange: '$3,000-5,000',
      bestMonths: 'Jun-Aug',
      region: 'Europe',
      regionKey: 'europe' as Region,
    },
    {
      id: 4,
      name: 'Cusco',
      country: 'Peru',
      image: 'https://images.unsplash.com/photo-1655067519728-1db2edccb6db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNodSUyMHBpY2NodSUyMHBlcnV8ZW58MXx8fHwxNzcxMjQ3MzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 64,
      costRange: '$1,500-2,800',
      bestMonths: 'Apr-Oct',
      region: 'Americas',
      regionKey: 'americas' as Region,
    },
    {
      id: 5,
      name: 'Marrakech',
      country: 'Morocco',
      image: 'https://images.unsplash.com/photo-1590414433316-b1124b9d0b54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JvY2NvJTIwbWFycmFrZWNofGVufDF8fHx8MTc3MTMwMjU3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 89,
      costRange: '$1,800-3,200',
      bestMonths: 'Mar-May, Sep-Nov',
      region: 'Africa',
      regionKey: 'africa' as Region,
    },
    {
      id: 6,
      name: 'Maldives',
      country: 'Maldives',
      image: 'https://images.unsplash.com/photo-1698726654862-377c0218dfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc3MTMwMDc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 54,
      costRange: '$4,000-8,000',
      bestMonths: 'Nov-Apr',
      region: 'Asia',
      regionKey: 'asia' as Region,
    },
    {
      id: 7,
      name: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1657106251952-2d584ebdf886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmUlMjBuaWdodHxlbnwxfHx8fDE3NzEyMzY1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 113,
      costRange: '$2,500-5,500',
      bestMonths: 'Nov-Mar',
      region: 'Middle East',
      regionKey: 'middle-east' as Region,
    },
    {
      id: 8,
      name: 'Cape Town',
      country: 'South Africa',
      image: 'https://images.unsplash.com/photo-1529528070131-eda9f3e90919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBlJTIwdG93biUyMHNvdXRoJTIwYWZyaWNhfGVufDF8fHx8MTc3MTMwMjU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 71,
      costRange: '$2,200-4,000',
      bestMonths: 'Nov-Mar',
      region: 'Africa',
      regionKey: 'africa' as Region,
    },
    {
      id: 9,
      name: 'Sydney',
      country: 'Australia',
      image: 'https://images.unsplash.com/photo-1627817972085-fb1697d97134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBzeWRuZXklMjBvcGVyYXxlbnwxfHx8fDE3NzEzMDI1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 87,
      costRange: '$3,500-6,000',
      bestMonths: 'Dec-Feb',
      region: 'Oceania',
      regionKey: 'oceania' as Region,
    },
    {
      id: 10,
      name: 'Interlaken',
      country: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1633942515338-6bfe46d316d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGFscHMlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcxMzAyMTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      itineraryCount: 93,
      costRange: '$3,800-6,500',
      bestMonths: 'Jun-Sep',
      region: 'Europe',
      regionKey: 'europe' as Region,
    },
  ];

  // Mock featured trips data
  const featuredTrips = [
    {
      id: 1,
      title: '10 Days in Rome & Amalfi Coast',
      destination: 'Italy',
      duration: '10 days',
      image: 'https://images.unsplash.com/photo-1757442745400-69f6f5c33726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwY29sb3NzZXVtJTIwY2l0eXxlbnwxfHx8fDE3NzEzMDIyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      creatorName: 'Sarah Mitchell',
      creatorInitials: 'SM',
      likes: 847,
      badge: 'staff-pick' as const,
    },
    {
      id: 2,
      title: 'Budget Backpacking Southeast Asia',
      destination: 'Thailand, Vietnam, Cambodia',
      duration: '21 days',
      image: 'https://images.unsplash.com/photo-1729864881494-d96345092845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMGphcGFuJTIwdGVtcGxlfGVufDF8fHx8MTc3MTI0MTc5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      creatorName: 'Alex Chen',
      creatorInitials: 'AC',
      likes: 1203,
      badge: 'popular' as const,
    },
    {
      id: 3,
      title: 'Ultimate Iceland Ring Road',
      destination: 'Iceland',
      duration: '8 days',
      image: 'https://images.unsplash.com/photo-1671273257845-a6032cdbec6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VsYW5kJTIwbGFuZHNjYXBlJTIwd2F0ZXJmYWxsfGVufDF8fHx8MTc3MTMwMjU3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      creatorName: 'Emma Wilson',
      creatorInitials: 'EW',
      likes: 692,
      badge: 'trending' as const,
    },
    {
      id: 4,
      title: 'Family Adventure in Costa Rica',
      destination: 'Costa Rica',
      duration: '12 days',
      image: 'https://images.unsplash.com/photo-1655067519728-1db2edccb6db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNodSUyMHBpY2NodSUyMHBlcnV8ZW58MXx8fHwxNzcxMjQ3MzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      creatorName: 'David Martinez',
      creatorInitials: 'DM',
      likes: 534,
    },
    {
      id: 5,
      title: 'Luxury Safari & Beach Combo',
      destination: 'Tanzania & Zanzibar',
      duration: '14 days',
      image: 'https://images.unsplash.com/photo-1529528070131-eda9f3e90919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBlJTIwdG93biUyMHNvdXRoJTIwYWZyaWNhfGVufDF8fHx8MTc3MTMwMjU3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      creatorName: 'Lisa Thompson',
      creatorInitials: 'LT',
      likes: 421,
      badge: 'staff-pick' as const,
    },
  ];

  const categories = [
    { id: 'popular', label: 'Popular' },
    { id: 'budget', label: 'Budget-friendly' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'family', label: 'Family' },
    { id: 'solo', label: 'Solo' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'culture', label: 'Culture' },
    { id: 'beach', label: 'Beach' },
  ];

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia', label: 'Asia' },
    { id: 'americas', label: 'Americas' },
    { id: 'africa', label: 'Africa' },
    { id: 'oceania', label: 'Oceania' },
    { id: 'middle-east', label: 'Middle East' },
  ];

  // Filter destinations
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = 
      searchQuery === '' ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = activeRegion === 'all' || dest.regionKey === activeRegion;
    
    return matchesSearch && matchesRegion;
  });

  const handleDestinationClick = (id: number) => {
    console.log('Viewing destination:', id);
    // In a real app, navigate to destination detail page
  };

  const handleTripClick = (id: number) => {
    console.log('Viewing trip:', id);
    // In a real app, navigate to shared itinerary view
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar isLoggedIn={true} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-medium mb-2">Explore Destinations</h1>
          <p className="text-gray-600 mb-6">
            Discover inspiring itineraries from our community of travelers
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Search destinations, trips, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as TripCategory)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id as Region)}
                className={`px-6 py-4 whitespace-nowrap border-b-2 transition-all ${
                  activeRegion === region.id
                    ? 'border-blue-600 text-blue-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Trips Carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-medium mb-1">Featured Trips</h2>
              <p className="text-gray-600">Curated by our travel experts</p>
            </div>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {featuredTrips.map((trip) => (
              <FeaturedTripCard
                key={trip.id}
                {...trip}
                onClick={() => handleTripClick(trip.id)}
              />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden space-y-4">
            {featuredTrips.slice(0, 3).map((trip) => (
              <div key={trip.id} className="w-full">
                <FeaturedTripCard
                  {...trip}
                  onClick={() => handleTripClick(trip.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-medium mb-1">Popular Destinations</h2>
            <p className="text-gray-600">
              {filteredDestinations.length} destinations found
            </p>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">
                No destinations found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  {...destination}
                  onClick={() => handleDestinationClick(destination.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
