import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

interface QuickEditPopoverProps {
  dayNumber: number;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  currentActivity: string;
  onGetSuggestions: (request: string, context: { day: number; timeSlot: string }) => void;
}

export function QuickEditPopover({
  dayNumber,
  timeSlot,
  currentActivity,
  onGetSuggestions,
}: QuickEditPopoverProps) {
  const [request, setRequest] = useState('');
  const [open, setOpen] = useState(false);

  const handleGetSuggestions = () => {
    if (request.trim()) {
      onGetSuggestions(request, { day: dayNumber, timeSlot });
      setRequest('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded">
          <Shuffle className="size-4 text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">What would you prefer?</h4>
            <p className="text-sm text-gray-600">
              Day {dayNumber} • {timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <p className="font-medium mb-1">Currently:</p>
            <p className="line-clamp-2">{currentActivity}</p>
          </div>

          <div>
            <Input
              type="text"
              placeholder="e.g., Something more relaxing, A food experience..."
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestions()}
            />
          </div>

          <Button
            onClick={handleGetSuggestions}
            disabled={!request.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Get Suggestions
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
