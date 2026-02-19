import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Share2, 
  DollarSign, 
  Calendar,
  MoreVertical,
  Users
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  imageUrl: string;
  dateRange: string;
  status: 'complete' | 'draft' | 'planning' | 'upcoming';
  budget: number;
  days: number;
  collaborators?: Array<{
    name: string;
    avatar?: string;
    initials: string;
  }>;
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export function TripCard({
  id,
  title,
  destination,
  imageUrl,
  dateRange,
  status,
  budget,
  days,
  collaborators,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onShare,
}: TripCardProps) {
  const [showActions, setShowActions] = useState(false);

  const statusConfig = {
    complete: { label: 'Complete', color: 'bg-green-600' },
    draft: { label: 'Draft', color: 'bg-yellow-600' },
    planning: { label: 'Planning...', color: 'bg-blue-600 animate-pulse' },
    upcoming: { label: 'Upcoming', color: 'bg-purple-600' },
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${statusConfig[status].color} text-white border-0`}>
            {statusConfig[status].label}
          </Badge>
        </div>

        {/* Trip Title & Date Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-xl font-medium mb-1 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Calendar className="size-4" />
            <span>{dateRange}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Collaborators */}
        {collaborators && collaborators.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-4 text-gray-600" />
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((collaborator, idx) => (
                <div
                  key={idx}
                  className="size-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                  title={collaborator.name}
                >
                  {collaborator.avatar ? (
                    <img
                      src={collaborator.avatar}
                      alt={collaborator.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    collaborator.initials
                  )}
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="size-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <DollarSign className="size-4" />
            <span className="font-medium">${budget.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium">{days} days</span>
          </div>
        </div>

        {/* Desktop: Hover Actions */}
        <div
          className={`hidden md:flex items-center gap-2 mt-4 transition-all duration-200 ${
            showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={onView}
            asChild
          >
            <Link to="/itinerary">
              <Eye className="size-4 mr-1" />
              View
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={onEdit}
          >
            <Edit className="size-4 mr-1" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="size-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="size-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile: Always visible actions */}
        <div className="md:hidden flex items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={onView}
            asChild
          >
            <Link to="/itinerary">
              <Eye className="size-4 mr-1" />
              View
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="size-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="size-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
