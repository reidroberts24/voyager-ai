import { useState } from 'react';
import { Clock, DollarSign, Shuffle, Umbrella, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ActivitySwapModal } from './ActivitySwapModal';
import { CommentThread } from '../sharing/CommentThread';

interface Activity {
  time: string;
  description: string;
  image?: string;
  cost?: number;
}

interface DayCardProps {
  dayNumber: number;
  title: string;
  date: string;
  city?: string;
  weather?: string;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
  rainPlan?: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  totalCost: number;
  onQuickEdit?: (request: string, context: { day: number; timeSlot: string }) => void;
  // Collaboration props
  canEdit?: boolean;
  canSuggest?: boolean;
  comments?: {
    morning: Array<{ id: string; author: { name: string; initials: string }; text: string; timestamp: string; isOwner?: boolean }>;
    afternoon: Array<{ id: string; author: { name: string; initials: string }; text: string; timestamp: string; isOwner?: boolean }>;
    evening: Array<{ id: string; author: { name: string; initials: string }; text: string; timestamp: string; isOwner?: boolean }>;
  };
  isOwner?: boolean;
  onAddComment?: (timeSlot: string, text: string) => void;
  onAcceptSuggestion?: (commentId: string) => void;
  onDismissSuggestion?: (commentId: string) => void;
}

export function DayCard({
  dayNumber,
  title,
  date,
  city,
  weather,
  morning,
  afternoon,
  evening,
  rainPlan,
  totalCost,
  onQuickEdit,
  canEdit = true,
  canSuggest = false,
  comments,
  isOwner = true,
  onAddComment,
  onAcceptSuggestion,
  onDismissSuggestion,
}: DayCardProps) {
  const [showRainPlan, setShowRainPlan] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{
    name: string;
    description: string;
    cost?: number;
    timeSlot: 'morning' | 'afternoon' | 'evening';
  } | null>(null);

  const handleSwapClick = (activity: Activity, timeSlot: 'morning' | 'afternoon' | 'evening', label: string) => {
    if (!canEdit) return;
    setSelectedActivity({
      name: label,
      description: activity.description,
      cost: activity.cost,
      timeSlot,
    });
    setSwapModalOpen(true);
  };

  const handleChooseAlternative = (alternative: any) => {
    console.log('Selected alternative:', alternative);
    // In a real app, this would update the activity
    setSwapModalOpen(false);
  };

  // Mock alternatives - in a real app, these would come from the AI
  const mockAlternatives = [
    {
      id: '1',
      name: 'Borghese Gallery & Gardens',
      description: 'Explore one of Rome\'s finest art galleries featuring masterpieces by Bernini, Caravaggio, and Raphael. After the museum, stroll through the beautiful manicured gardens.',
      cost: 55,
      category: 'Museum',
      categoryColor: 'bg-purple-600',
      time: '3 hours',
      image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=400',
    },
    {
      id: '2',
      name: 'Appian Way Bike Tour',
      description: 'Cycle along the ancient Appian Way, one of Rome\'s most important roads. Visit catacombs, ancient ruins, and enjoy the scenic countryside just outside the city.',
      cost: 65,
      category: 'Outdoor',
      categoryColor: 'bg-green-600',
      time: '4 hours',
      image: 'https://images.unsplash.com/photo-1541542585903-14e1b27647c3?w=400',
    },
    {
      id: '3',
      name: 'Food Tour in Testaccio',
      description: 'Discover Rome\'s authentic food scene in the local Testaccio neighborhood. Enjoy 8+ tastings including street food, pasta, gelato, and traditional Roman specialties.',
      cost: 79,
      category: 'Food',
      categoryColor: 'bg-orange-600',
      time: '3.5 hours',
      image: 'https://images.unsplash.com/photo-1655662844229-d2c2a81f09ec?w=400',
    },
    {
      id: '4',
      name: 'Palatine Hill & Forum Romana',
      description: 'Explore the birthplace of Rome on Palatine Hill with stunning views over the Forum. Walk through ancient imperial palaces and learn about the city\'s founding legends.',
      cost: 45,
      category: 'History',
      categoryColor: 'bg-amber-700',
      time: '2.5 hours',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
    },
    {
      id: '5',
      name: 'Cooking Class in Trastevere',
      description: 'Learn to make authentic Roman dishes like Cacio e Pepe and Carbonara with a local chef. Shop for ingredients at the market, cook a 3-course meal, and enjoy your creations.',
      cost: 89,
      category: 'Food',
      categoryColor: 'bg-orange-600',
      time: '4 hours',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    },
  ];

  const ActivityBlock = ({ label, activity, timeSlot }: { label: string; activity: Activity; timeSlot: 'morning' | 'afternoon' | 'evening' }) => (
    <div className="bg-gray-50 rounded-xl p-5 relative group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-gray-600" />
          <span className="font-medium text-gray-900">{label}</span>
          <span className="text-sm text-gray-500">{activity.time}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Comment Thread */}
          {(canSuggest || isOwner) && comments && (
            <CommentThread
              dayNumber={dayNumber}
              timeSlot={label}
              comments={comments[timeSlot] || []}
              onAddComment={(text) => onAddComment?.(timeSlot, text)}
              onAcceptSuggestion={onAcceptSuggestion}
              onDismissSuggestion={onDismissSuggestion}
              canComment={canSuggest || isOwner}
              isOwner={isOwner}
            />
          )}
          
          {/* Swap Button */}
          {canEdit && (
            <button
              onClick={() => handleSwapClick(activity, timeSlot, label)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 rounded-lg"
              title="Swap activity"
            >
              <Shuffle className="size-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {activity.image && (
          <img
            src={activity.image}
            alt={label}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <p className="text-gray-700 leading-relaxed">{activity.description}</p>
          {activity.cost && (
            <Badge variant="secondary" className="mt-2">
              <DollarSign className="size-3" />
              ~${activity.cost}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Day Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  Day {dayNumber}
                </span>
                {weather && (
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {weather}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-medium">{title}</h3>
              <div className="flex items-center gap-3 text-white/90 text-sm mt-1">
                <span>{date}</span>
                {city && (
                  <>
                    <span>•</span>
                    <span>{city}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Time Blocks */}
        <div className="p-6 space-y-4">
          <ActivityBlock label="Morning" activity={morning} timeSlot="morning" />
          <ActivityBlock label="Afternoon" activity={afternoon} timeSlot="afternoon" />
          <ActivityBlock label="Evening" activity={evening} timeSlot="evening" />

          {/* Rain Plan Accordion */}
          {rainPlan && (
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowRainPlan(!showRainPlan)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors w-full"
              >
                <Umbrella className="size-4" />
                <span className="font-medium">If it rains:</span>
                <ChevronDown
                  className={`size-4 ml-auto transition-transform ${
                    showRainPlan ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showRainPlan && (
                <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Alternative Morning</p>
                    <p className="text-sm text-blue-800">{rainPlan.morning}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Alternative Afternoon</p>
                    <p className="text-sm text-blue-800">{rainPlan.afternoon}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Alternative Evening</p>
                    <p className="text-sm text-blue-800">{rainPlan.evening}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Day Total */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <div className="text-right">
              <p className="text-sm text-gray-600">Day total</p>
              <p className="text-xl font-medium text-gray-900">${totalCost}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Swap Modal */}
      {selectedActivity && (
        <ActivitySwapModal
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          currentActivity={{
            name: selectedActivity.name,
            description: selectedActivity.description,
            cost: selectedActivity.cost,
          }}
          dayNumber={dayNumber}
          timeSlot={selectedActivity.timeSlot}
          alternatives={mockAlternatives}
          onChoose={handleChooseAlternative}
        />
      )}
    </>
  );
}