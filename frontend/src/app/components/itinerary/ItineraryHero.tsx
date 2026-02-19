import { Share2, Download, FileText, Edit, Heart, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface ItineraryHeroProps {
  title: string;
  dateRange: string;
  travelers: number;
  heroImage: string;
  cities?: Array<{ name: string; dates: string }>;
}

export function ItineraryHero({ title, dateRange, travelers, heroImage, cities }: ItineraryHeroProps) {
  return (
    <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl text-white mb-4">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="size-5" />
                <span>{dateRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-5" />
                <span>{travelers} {travelers === 1 ? 'traveler' : 'travelers'}</span>
              </div>
            </div>
          </div>

          {/* Multi-city route */}
          {cities && cities.length > 1 && (
            <div className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 inline-block">
              <div className="flex items-center gap-3">
                {cities.map((city, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-white font-medium">{city.name}</p>
                      <p className="text-sm text-white/70">{city.dates}</p>
                    </div>
                    {idx < cities.length - 1 && (
                      <ArrowRight className="size-5 text-white/70" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30">
              <Share2 className="size-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30">
              <Download className="size-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30">
              <FileText className="size-4" />
              <span className="hidden sm:inline">Markdown</span>
            </Button>
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30">
              <Edit className="size-4" />
              <span className="hidden sm:inline">Edit Trip</span>
            </Button>
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30">
              <Heart className="size-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
