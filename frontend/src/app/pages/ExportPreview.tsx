import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PreviewDocument } from '../components/export/PreviewDocument';
import { ExportControls } from '../components/export/ExportControls';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

type ExportFormat = 'pdf' | 'markdown' | 'print';

export default function ExportPreview() {
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [zoom, setZoom] = useState(1);
  const [includedSections, setIncludedSections] = useState({
    flights: true,
    hotels: true,
    weather: true,
    budget: true,
    tips: true,
    rainPlans: true,
  });

  // Mock trip data
  const tripData = {
    title: '5 Days in Rome',
    destination: 'Rome, Italy',
    dateRange: 'June 16-20, 2026',
    travelers: 2,
    heroImage: 'https://images.unsplash.com/photo-1593290594022-1ca482d107e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21lJTIwY2l0eXNjYXBlJTIwcGFub3JhbWElMjBzdW5zZXR8ZW58MXx8fHwxNzcxMzAxMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Ancient Rome',
        date: 'June 16, 2026',
        morning: {
          time: '9:00 AM',
          description: 'Arrive in Rome and check into your hotel. Take some time to settle in and freshen up. Grab a quick breakfast at a local café and enjoy your first Italian espresso.',
          cost: 15,
        },
        afternoon: {
          time: '2:00 PM',
          description: 'Visit the Colosseum with a skip-the-line guided tour. Explore the ancient amphitheater where gladiators once fought, and learn about the fascinating history of Roman entertainment.',
          cost: 65,
        },
        evening: {
          time: '7:00 PM',
          description: 'Dinner in Trastevere, one of Rome\'s most charming neighborhoods. Dine at a traditional trattoria and try authentic Cacio e Pepe or Carbonara.',
          cost: 45,
        },
        rainPlan: {
          morning: 'Explore the National Roman Museum - Palazzo Massimo, home to incredible ancient Roman art.',
          afternoon: 'Visit the Pantheon (covered entrance) and nearby museums.',
          evening: 'Dinner at a covered restaurant in Campo de\' Fiori area.',
        },
        totalCost: 125,
      },
      {
        dayNumber: 2,
        title: 'Vatican City & Spiritual Rome',
        date: 'June 17, 2026',
        morning: {
          time: '8:00 AM',
          description: 'Early entry to the Vatican Museums to beat the crowds. Marvel at the Sistine Chapel ceiling painted by Michelangelo.',
          cost: 75,
        },
        afternoon: {
          time: '1:00 PM',
          description: 'Visit St. Peter\'s Basilica and climb to the dome for panoramic views of Rome.',
          cost: 35,
        },
        evening: {
          time: '6:00 PM',
          description: 'Sunset visit to Castel Sant\'Angelo. Walk across the Tiber River and enjoy dinner in the Prati neighborhood.',
          cost: 50,
        },
        rainPlan: {
          morning: 'Extended time in Vatican Museums - they\'re entirely indoors.',
          afternoon: 'Visit underground crypts near St. Peter\'s for a unique experience.',
          evening: 'Wine tasting at a cozy enoteca in the covered Prati area.',
        },
        totalCost: 160,
      },
    ],

    flights: [
      {
        airline: 'Delta',
        flightNumber: 'DL 123',
        date: 'June 16, 2026',
        departure: { time: '10:30 AM', airport: 'JFK, New York' },
        arrival: { time: '11:45 PM', airport: 'FCO, Rome' },
        price: 850,
        class: 'Economy',
      },
      {
        airline: 'Delta',
        flightNumber: 'DL 456',
        date: 'June 20, 2026',
        departure: { time: '2:15 PM', airport: 'FCO, Rome' },
        arrival: { time: '5:30 PM', airport: 'JFK, New York' },
        price: 920,
        class: 'Economy',
      },
    ],

    hotels: [
      {
        name: 'Hotel Artemide',
        address: 'Via Nazionale 22, Rome, 00184',
        checkIn: 'June 16, 2026 - 3:00 PM',
        checkOut: 'June 20, 2026 - 11:00 AM',
        nights: 4,
        pricePerNight: 180,
        totalPrice: 720,
      },
    ],

    budget: {
      flights: 1770,
      hotels: 720,
      activities: 450,
      food: 350,
      transport: 150,
      total: 3440,
    },

    tips: [
      'Book skip-the-line tickets for major attractions like the Colosseum and Vatican Museums in advance.',
      'Rome is best explored on foot, but wear comfortable shoes as you\'ll walk miles on cobblestone streets.',
      'Most restaurants close between 3-7 PM, so plan your meals accordingly.',
      'Dress modestly when visiting churches - cover shoulders and knees.',
      'Keep small bills handy for tipping and small purchases. Most places accept cards, but not all.',
    ],
  };

  const handleToggleSection = (section: keyof typeof includedSections) => {
    setIncludedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDownload = () => {
    toast.success(`Preparing ${selectedFormat.toUpperCase()} download...`);
    console.log('Download:', selectedFormat);
  };

  const handleEmail = () => {
    toast.success('Opening email dialog...');
    console.log('Email export');
  };

  const handleShareLink = () => {
    const link = 'https://voyager-ai.com/export/abc123xyz';
    navigator.clipboard.writeText(link);
    toast.success('Shareable PDF link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/itinerary')}>
                <X className="size-5" />
              </Button>
              <div>
                <h1 className="text-xl font-medium">Export Preview</h1>
                <p className="text-sm text-gray-600">{tripData.title}</p>
              </div>
            </div>

            {/* Desktop Zoom Controls */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="size-4" />
              </Button>
              <span className="text-sm font-medium w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <ZoomIn className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Preview Pane - Desktop */}
          <div className="hidden md:block flex-1 bg-gray-200 rounded-lg p-8 overflow-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <div
              className="origin-top transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              <PreviewDocument tripData={tripData} includedSections={includedSections} />
            </div>
          </div>

          {/* Mobile Preview - Full Width */}
          <div className="md:hidden w-full overflow-auto pb-32" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <PreviewDocument tripData={tripData} includedSections={includedSections} />
          </div>

          {/* Controls Sidebar - Desktop Only */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <ExportControls
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                includedSections={includedSections}
                onToggleSection={handleToggleSection}
                onDownload={handleDownload}
                onEmail={handleEmail}
                onShareLink={handleShareLink}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="grid grid-cols-3 gap-2 mb-2">
          {['pdf', 'markdown', 'print'].map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format as ExportFormat)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                selectedFormat === format
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Download
          </Button>
          <Button onClick={handleEmail} variant="outline">
            Email
          </Button>
          <Button onClick={handleShareLink} variant="outline">
            Share
          </Button>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: 'bg-white border border-gray-200 shadow-lg',
            title: 'text-gray-900',
            description: 'text-gray-600',
            success: 'border-green-600',
            error: 'border-red-600',
          },
        }}
      />
    </div>
  );
}
