import { Star, Wifi, Coffee, Waves, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface HotelCardProps {
  name: string;
  image: string;
  rating: number;
  reviewScore: number;
  reviewCount: number;
  pricePerNight: number;
  nights: number;
  totalPrice: number;
  amenities: Array<'wifi' | 'breakfast' | 'pool'>;
  location?: string;
  isRecommended?: boolean;
  isConfirmed?: boolean;
}

export function HotelCard({
  name,
  image,
  rating,
  reviewScore,
  reviewCount,
  pricePerNight,
  nights,
  totalPrice,
  amenities,
  location,
  isRecommended,
  isConfirmed,
}: HotelCardProps) {
  const getAmenityIcon = (amenity: 'wifi' | 'breakfast' | 'pool') => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="size-4" />;
      case 'breakfast':
        return <Coffee className="size-4" />;
      case 'pool':
        return <Waves className="size-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-shadow">
      {/* Hotel Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isRecommended && (
          <Badge className="absolute top-3 right-3 bg-green-600">
            Recommended
          </Badge>
        )}
        {isConfirmed && (
          <Badge className="absolute top-3 right-3 bg-blue-600">
            Confirmed
          </Badge>
        )}
      </div>

      {/* Hotel Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-medium mb-1">{name}</h3>
          {location && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <MapPin className="size-3" />
              <span>{location}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{reviewScore}</span>
              <span className="text-gray-600">({reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex gap-2 mb-4">
          {amenities.map((amenity, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1 text-sm text-gray-700"
            >
              {getAmenityIcon(amenity)}
              <span className="capitalize">{amenity}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-200 pt-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-600">
              ${pricePerNight}/night × {nights} nights
            </p>
            <p className="text-2xl font-medium text-gray-900">${totalPrice}</p>
          </div>
          {!isConfirmed && (
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Select
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
