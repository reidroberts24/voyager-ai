import { DollarSign, Clock, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

interface AlternativeCardProps {
  number: number;
  name: string;
  description: string;
  cost: number;
  time?: string;
  location?: string;
  image?: string;
  onChoose: () => void;
}

export function AlternativeCard({
  number,
  name,
  description,
  cost,
  time,
  location,
  image,
  onChoose,
}: AlternativeCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors group">
      <div className="flex gap-3 mb-3">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white size-8 rounded-full flex items-center justify-center font-medium flex-shrink-0">
          {number}
        </div>
        {image && (
          <img
            src={image}
            alt={name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 mb-1">{name}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
        {time && (
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{time}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="size-4" />
            <span>{location}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <DollarSign className="size-4" />
          <span>~${cost}</span>
        </div>
      </div>

      <Button
        onClick={onChoose}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Choose Option {number}
      </Button>
    </div>
  );
}
