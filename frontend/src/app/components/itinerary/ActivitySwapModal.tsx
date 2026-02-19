import { useState } from 'react';
import { X, Check, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Alternative {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  categoryColor: string;
  time?: string;
  image?: string;
}

interface ActivitySwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentActivity: {
    name: string;
    description: string;
    cost?: number;
  };
  dayNumber: number;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  alternatives: Alternative[];
  onChoose: (alternative: Alternative) => void;
}

export function ActivitySwapModal({
  isOpen,
  onClose,
  currentActivity,
  dayNumber,
  timeSlot,
  alternatives,
  onChoose,
}: ActivitySwapModalProps) {
  const [showMore, setShowMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const timeSlotLabel = timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1);
  const displayedAlternatives = showMore ? alternatives : alternatives.slice(0, 3);

  const handleChoose = (alternative: Alternative) => {
    setSelectedId(alternative.id);
    setIsAnimating(true);

    // Success animation, then close
    setTimeout(() => {
      onChoose(alternative);
      setIsAnimating(false);
      setSelectedId(null);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop Modal */}
      <div className="hidden md:block">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Day {dayNumber}
                </div>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-600">{timeSlotLabel}</span>
              </div>
              <h2 className="text-2xl font-medium">
                Alternatives for: {currentActivity.name}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Current Activity (Reference) */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Current activity:</p>
            <div className="bg-white/60 rounded-xl p-4 border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-1">{currentActivity.name}</h3>
              <p className="text-sm text-gray-600">{currentActivity.description}</p>
              {currentActivity.cost && (
                <Badge variant="secondary" className="mt-2">
                  ${currentActivity.cost}
                </Badge>
              )}
            </div>
          </div>

          {/* Alternatives List */}
          <div className="overflow-y-auto max-h-[50vh] p-6">
            <div className="space-y-4">
              {displayedAlternatives.map((alt, idx) => (
                <div
                  key={alt.id}
                  className={`border-2 rounded-xl p-5 transition-all ${
                    selectedId === alt.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-4">
                    {alt.image && (
                      <img
                        src={alt.image}
                        alt={alt.name}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-1">{alt.name}</h3>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {alt.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={alt.categoryColor}>
                          {alt.category}
                        </Badge>
                        <Badge variant="secondary">
                          ${alt.cost}
                        </Badge>
                        {alt.time && (
                          <span className="text-sm text-gray-600">• {alt.time}</span>
                        )}
                      </div>

                      <Button
                        onClick={() => handleChoose(alt)}
                        disabled={isAnimating}
                        className={`w-full ${
                          selectedId === alt.id
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {selectedId === alt.id ? (
                          <>
                            <Check className="size-5 mr-2" />
                            Selected!
                          </>
                        ) : (
                          'Choose This'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {alternatives.length > 3 && !showMore && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setShowMore(true)}
              >
                Show More Alternatives
                <ChevronDown className="size-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isAnimating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Drag Handle */}
          <div className="flex justify-center py-3 border-b border-gray-200">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Day {dayNumber}
                </div>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-600">{timeSlotLabel}</span>
              </div>
              <h2 className="text-lg font-medium line-clamp-2">
                Alternatives for: {currentActivity.name}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Current Activity */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <p className="text-xs text-gray-600 mb-2">Current activity:</p>
            <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-1">{currentActivity.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{currentActivity.description}</p>
            </div>
          </div>

          {/* Alternatives List */}
          <div className="overflow-y-auto flex-1 p-4">
            <div className="space-y-4">
              {displayedAlternatives.map((alt) => (
                <div
                  key={alt.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedId === alt.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  {alt.image && (
                    <img
                      src={alt.image}
                      alt={alt.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  <h3 className="font-medium mb-2">{alt.name}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {alt.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={alt.categoryColor}>
                      {alt.category}
                    </Badge>
                    <Badge variant="secondary">
                      ${alt.cost}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleChoose(alt)}
                    disabled={isAnimating}
                    className={`w-full ${
                      selectedId === alt.id
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {selectedId === alt.id ? (
                      <>
                        <Check className="size-5 mr-2" />
                        Selected!
                      </>
                    ) : (
                      'Choose This'
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {alternatives.length > 3 && !showMore && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setShowMore(true)}
              >
                Show More Alternatives
                <ChevronDown className="size-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isAnimating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
