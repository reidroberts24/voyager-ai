import { MapPin, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  itineraryCount: number;
  costRange: string;
  bestMonths: string;
  region: string;
  onClick?: () => void;
}

export function DestinationCard({
  name,
  country,
  image,
  itineraryCount,
  costRange,
  bestMonths,
  region,
  onClick,
}: DestinationCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200"
    >
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Region Badge */}
        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-900 border-0">
          {region}
        </Badge>

        {/* Destination Name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-2xl font-medium mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="size-4" />
            <span className="text-sm">{country}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        {/* Itinerary Count */}
        <div className="flex items-center gap-2 text-blue-600">
          <TrendingUp className="size-4" />
          <span className="font-medium">
            {itineraryCount} shared {itineraryCount === 1 ? 'itinerary' : 'itineraries'}
          </span>
        </div>

        {/* Cost Range */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4" />
            <span>Avg. cost: {costRange}</span>
          </div>
        </div>

        {/* Best Months */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="size-4" />
          <span>Best: {bestMonths}</span>
        </div>

        {/* View Button */}
        <div className="pt-2">
          <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all">
            Explore Itineraries
          </button>
        </div>
      </div>
    </div>
  );
}
