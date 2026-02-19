import { Clock, Users, Star, Award } from 'lucide-react';
import { Badge } from '../ui/badge';

interface FeaturedTripCardProps {
  title: string;
  destination: string;
  duration: string;
  image: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorInitials: string;
  likes: number;
  badge?: 'staff-pick' | 'popular' | 'trending';
  onClick?: () => void;
}

export function FeaturedTripCard({
  title,
  destination,
  duration,
  image,
  creatorName,
  creatorAvatar,
  creatorInitials,
  likes,
  badge,
  onClick,
}: FeaturedTripCardProps) {
  const badgeConfig = {
    'staff-pick': { label: 'Staff Pick', icon: Award, color: 'bg-purple-600' },
    'popular': { label: 'Most Popular', icon: Star, color: 'bg-blue-600' },
    'trending': { label: 'Trending', icon: Star, color: 'bg-orange-600' },
  };

  const BadgeIcon = badge ? badgeConfig[badge].icon : null;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex-shrink-0 w-80"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badge */}
        {badge && BadgeIcon && (
          <Badge className={`absolute top-3 left-3 ${badgeConfig[badge].color} text-white border-0`}>
            <BadgeIcon className="size-3 mr-1" />
            {badgeConfig[badge].label}
          </Badge>
        )}

        {/* Duration */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-md">
          <Clock className="size-3 text-gray-700" />
          <span className="text-xs font-medium text-gray-700">{duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{destination}</p>

        {/* Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
              {creatorAvatar ? (
                <img
                  src={creatorAvatar}
                  alt={creatorName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                creatorInitials
              )}
            </div>
            <span className="text-sm text-gray-700">{creatorName}</span>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="size-4" />
            <span className="text-sm">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
