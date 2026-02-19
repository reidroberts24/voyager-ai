import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1672622851784-0dbd3df4c088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW50b3JpbmklMjBzdW5zZXQlMjB3aGl0ZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NzEzMDAyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Santorini sunset',
  },
  {
    url: 'https://images.unsplash.com/photo-1730385835399-4d0f24898919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMG5pZ2h0JTIwbmVvbiUyMHN0cmVldHN8ZW58MXx8fHwxNzcxMzAwMjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Tokyo night streets',
  },
  {
    url: 'https://images.unsplash.com/photo-1674249283858-a9f4eea4beff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXRhZ29uaWElMjBtb3VudGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxMzAwMjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Patagonia mountains',
  },
];

const QUICK_START_CHIPS = [
  'Weekend in Paris',
  'Family trip to Orlando',
  '2 weeks in Japan',
  'Budget backpacking SE Asia',
];

interface HeroSectionProps {
  onStartPlanning?: (query: string) => void;
}

export function HeroSection({ onStartPlanning }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (onStartPlanning && searchQuery) {
      onStartPlanning(searchQuery);
    }
  };

  const handleQuickStart = (query: string) => {
    setSearchQuery(query);
    if (onStartPlanning) {
      onStartPlanning(query);
    }
  };

  return (
    <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background images with crossfade */}
      {HERO_IMAGES.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: index === currentImageIndex ? 1 : 0,
          }}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl mb-4 text-white">
          Your AI Travel Agent
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-white/90">
          Plan your perfect trip in minutes with AI-powered research
        </p>

        {/* Search input */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex gap-2 bg-white rounded-full p-2 shadow-2xl">
            <Input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border-0 focus-visible:ring-0 text-lg px-6 bg-transparent"
            />
            <Button
              onClick={handleSearch}
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
              <Send className="size-5" />
            </Button>
          </div>
        </div>

        {/* Quick start chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_START_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleQuickStart(chip)}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full text-white transition-all hover:scale-105"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`size-2 rounded-full transition-all ${
              index === currentImageIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}