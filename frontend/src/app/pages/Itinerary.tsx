import { useLocation, Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { MessageCircle, Share2, Download } from 'lucide-react';
import { ItineraryHero } from '../components/itinerary/ItineraryHero';
import { ItineraryNav } from '../components/itinerary/ItineraryNav';
import { OverviewSection } from '../components/itinerary/OverviewSection';
import { DayCard } from '../components/itinerary/DayCard';
import { FlightCard } from '../components/itinerary/FlightCard';
import { HotelCard } from '../components/itinerary/HotelCard';
import { BudgetSection } from '../components/itinerary/BudgetSection';
import { TipsSection } from '../components/itinerary/TipsSection';
import { RefinementChat } from '../components/itinerary/RefinementChat';
import { ShareModal } from '../components/sharing/ShareModal';
import { CollaboratorBanner } from '../components/sharing/CollaboratorBanner';
import { toast } from 'sonner';

export default function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const tripDetails = location.state?.tripDetails || {};
  const [isRefinementOpen, setIsRefinementOpen] = useState(false);
  const [refinementContext, setRefinementContext] = useState<string>('');
  
  // Sharing state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [publicLinkEnabled, setPublicLinkEnabled] = useState(false);
  const [collaborators, setCollaborators] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      initials: 'SJ',
      permission: 'edit' as const,
    },
  ]);
  
  // Collaboration state - simulate being a shared trip
  const isSharedTrip = false; // Set to true to test shared view
  const viewerPermission: 'view' | 'edit' | 'suggest' = 'edit';
  const tripOwner = {
    name: 'John Doe',
    initials: 'JD',
  };
  
  // Comments state
  const [comments, setComments] = useState<any>({
    1: {
      morning: [],
      afternoon: [
        {
          id: 'c1',
          author: { name: 'Sarah Johnson', initials: 'SJ' },
          text: 'Could we add a food tour instead? I heard the Testaccio neighborhood has amazing food experiences.',
          timestamp: '2 hours ago',
        },
      ],
      evening: [],
    },
    2: { morning: [], afternoon: [], evening: [] },
    3: { morning: [], afternoon: [], evening: [] },
    4: { morning: [], afternoon: [], evening: [] },
    5: { morning: [], afternoon: [], evening: [] },
  });

  const shareLink = 'https://voyager-ai.com/trip/abc123xyz';

  // Mock data for the itinerary
  const itineraryData = {
    title: '5 Days in Rome',
    dateRange: 'June 16-20, 2026',
    travelers: 2,
    heroImage: 'https://images.unsplash.com/photo-1593290594022-1ca482d107e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21lJTIwY2l0eXNjYXBlJTIwcGFub3JhbWElMjBzdW5zZXR8ZW58MXx8fHwxNzcxMzAxMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    
    description: `Rome, the Eternal City, is a captivating blend of ancient history and vibrant modern life. With over 2,500 years of history, every cobblestone street tells a story. From the iconic Colosseum to the spiritual heart of Vatican City, Rome offers an unparalleled journey through Western civilization.\n\nThe city's artistic treasures are legendary—Michelangelo's Sistine Chapel, Bernini's fountains, and Caravaggio's masterpieces await around every corner. But Rome isn't just a museum. It's a living, breathing city where locals gather in piazzas, espresso flows freely, and the aroma of fresh pasta fills the air.\n\nThis itinerary balances must-see landmarks with hidden gems, ensuring you experience Rome like a local while covering the essential sights. We've factored in the best times to visit popular attractions, recommended authentic trattorias, and included backup plans for rainy days.`,
    
    inlineImages: [
      'https://images.unsplash.com/photo-1764505551920-dd3ea7f83d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21hbiUyMENvbG9zc2V1bSUyMGludGVyaW9yJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MTMwMTI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1727179468863-f0b56f41aa2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUcmV2aSUyMEZvdW50YWluJTIwUm9tZSUyMHRvdXJpc3RzfGVufDF8fHx8MTc3MTMwMTI4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],

    weather: [
      { date: 'Jun 16', icon: 'sun' as const, high: 28, low: 18 },
      { date: 'Jun 17', icon: 'sun' as const, high: 29, low: 19 },
      { date: 'Jun 18', icon: 'cloud' as const, high: 26, low: 17 },
      { date: 'Jun 19', icon: 'sun' as const, high: 27, low: 18 },
      { date: 'Jun 20', icon: 'sun' as const, high: 28, low: 19 },
    ],

    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Ancient Rome',
        date: 'June 16, 2026',
        city: 'Rome',
        weather: '☀️ 28°C',
        morning: {
          time: '9:00 AM',
          description: 'Arrive in Rome and check into your hotel. Take some time to settle in and freshen up. Grab a quick breakfast at a local café and enjoy your first Italian espresso.',
          cost: 15,
        },
        afternoon: {
          time: '2:00 PM',
          description: 'Visit the Colosseum with a skip-the-line guided tour. Explore the ancient amphitheater where gladiators once fought, and learn about the fascinating history of Roman entertainment. Continue to the Roman Forum and Palatine Hill.',
          image: 'https://images.unsplash.com/photo-1764505551920-dd3ea7f83d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21hbiUyMENvbG9zc2V1bSUyMGludGVyaW9yJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MTMwMTI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          cost: 65,
        },
        evening: {
          time: '7:00 PM',
          description: 'Dinner in Trastevere, one of Rome\'s most charming neighborhoods. Dine at a traditional trattoria and try authentic Cacio e Pepe or Carbonara. After dinner, stroll through the cobblestone streets and enjoy the vibrant nightlife.',
          image: 'https://images.unsplash.com/photo-1759843541048-95dcad7bb44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21lJTIwc3RyZWV0JTIwY2FmZSUyMG91dGRvb3J8ZW58MXx8fHwxNzcxMzAxMjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          cost: 45,
        },
        rainPlan: {
          morning: 'Explore the National Roman Museum - Palazzo Massimo, home to incredible ancient Roman art and sculptures.',
          afternoon: 'Visit the Pantheon (covered entrance) and nearby museums. The Pantheon is one of the best-preserved Roman buildings.',
          evening: 'Dinner at a covered restaurant in Campo de\' Fiori area, followed by gelato tasting at a historic gelateria.',
        },
        totalCost: 125,
      },
      {
        dayNumber: 2,
        title: 'Vatican City & Spiritual Rome',
        date: 'June 17, 2026',
        city: 'Rome',
        weather: '☀️ 29°C',
        morning: {
          time: '8:00 AM',
          description: 'Early entry to the Vatican Museums to beat the crowds. Marvel at the Sistine Chapel ceiling painted by Michelangelo, explore the Raphael Rooms, and wander through one of the world\'s greatest art collections.',
          image: 'https://images.unsplash.com/photo-1722441521673-3e8601897460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYXRpY2FuJTIwUm9tZSUyMG11c2V1bSUyMGFydHxlbnwxfHx8fDE3NzEzMDEyODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          cost: 75,
        },
        afternoon: {
          time: '1:00 PM',
          description: 'Visit St. Peter\'s Basilica and climb to the dome for panoramic views of Rome. Explore St. Peter\'s Square and admire Bernini\'s colonnade. Lunch at a nearby restaurant with views of the Vatican.',
          cost: 35,
        },
        evening: {
          time: '6:00 PM',
          description: 'Sunset visit to Castel Sant\'Angelo, originally built as a mausoleum for Emperor Hadrian. Walk across the Tiber River and enjoy dinner in the Prati neighborhood, known for excellent local restaurants.',
          cost: 50,
        },
        rainPlan: {
          morning: 'Extended time in Vatican Museums - they\'re entirely indoors with hours of content to explore.',
          afternoon: 'Visit the Basilica Cistern and underground crypts near St. Peter\'s for a unique rainy day experience.',
          evening: 'Wine tasting and dinner at a cozy enoteca (wine bar) in the covered Prati area.',
        },
        totalCost: 160,
      },
      {
        dayNumber: 3,
        title: 'Baroque Rome & Fountains',
        date: 'June 18, 2026',
        city: 'Rome',
        weather: '⛅ 26°C',
        morning: {
          time: '9:00 AM',
          description: 'Start at Piazza Navona, Rome\'s most beautiful square featuring Bernini\'s Fountain of the Four Rivers. Visit the nearby Pantheon, a 2,000-year-old architectural marvel. Enjoy coffee at a historic café.',
          cost: 20,
        },
        afternoon: {
          time: '2:00 PM',
          description: 'Throw a coin into the Trevi Fountain and make a wish. Explore the Spanish Steps and the surrounding designer shopping district. Visit the beautiful Borghese Gallery (book in advance) to see sculptures and paintings by Bernini and Caravaggio.',
          image: 'https://images.unsplash.com/photo-1727179468863-f0b56f41aa2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUcmV2aSUyMEZvdW50YWluJTIwUm9tZSUyMHRvdXJpc3RzfGVufDF8fHx8MTc3MTMwMTI4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          cost: 55,
        },
        evening: {
          time: '7:00 PM',
          description: 'Aperitivo in the Campo de\' Fiori area - enjoy the Italian tradition of pre-dinner drinks and snacks. Dinner at a local osteria, followed by an evening walk through the illuminated historic center.',
          image: 'https://images.unsplash.com/photo-1655662844229-d2c2a81f09ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJdGFsaWFuJTIwcGFzdGElMjBjYXJib25hcmElMjBmb29kfGVufDF8fHx8MTc3MTMwMTI4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          cost: 40,
        },
        rainPlan: {
          morning: 'Visit the covered Galleria Alberto Sordi for shopping and coffee, then explore the Pantheon.',
          afternoon: 'Extended visit to Borghese Gallery, followed by the nearby National Gallery of Modern Art.',
          evening: 'Traditional Roman dinner at a historic indoor restaurant, followed by a theater or opera performance.',
        },
        totalCost: 115,
      },
    ],

    flights: [
      {
        outbound: {
          origin: 'JFK',
          destination: 'FCO',
          airline: 'ITA Airways',
          departure: '6:30 PM',
          arrival: '8:45 AM+1',
          duration: '8h 15m',
          stops: 0,
        },
        return: {
          origin: 'FCO',
          destination: 'JFK',
          airline: 'ITA Airways',
          departure: '11:00 AM',
          arrival: '2:30 PM',
          duration: '9h 30m',
          stops: 0,
        },
        pricePerPerson: 926,
        totalPrice: 1852,
        isRecommended: true,
      },
      {
        outbound: {
          origin: 'JFK',
          destination: 'FCO',
          airline: 'Delta',
          departure: '10:15 PM',
          arrival: '12:30 PM+1',
          duration: '8h 15m',
          stops: 0,
        },
        return: {
          origin: 'FCO',
          destination: 'JFK',
          airline: 'Delta',
          departure: '1:45 PM',
          arrival: '5:20 PM',
          duration: '9h 35m',
          stops: 0,
        },
        pricePerPerson: 1145,
        totalPrice: 2290,
      },
    ],

    hotels: [
      {
        name: 'Hotel Artemide',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        rating: 4,
        reviewScore: 9.2,
        reviewCount: 1847,
        pricePerNight: 180,
        nights: 5,
        totalPrice: 900,
        amenities: ['wifi' as const, 'breakfast' as const],
        location: 'Historic Center, near Termini Station',
        isRecommended: true,
      },
      {
        name: 'The Inn At The Roman Forum',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        rating: 5,
        reviewScore: 9.5,
        reviewCount: 892,
        pricePerNight: 320,
        nights: 5,
        totalPrice: 1600,
        amenities: ['wifi' as const, 'breakfast' as const, 'pool' as const],
        location: 'Monti, steps from the Forum',
      },
      {
        name: 'Hotel Quirinale',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        rating: 4,
        reviewScore: 8.9,
        reviewCount: 2103,
        pricePerNight: 145,
        nights: 5,
        totalPrice: 725,
        amenities: ['wifi' as const, 'breakfast' as const],
        location: 'Near Opera House and Trevi Fountain',
      },
    ],

    budgetCategories: [
      { label: 'Flights', amount: 1852, color: 'bg-blue-500' },
      { label: 'Hotels', amount: 900, color: 'bg-purple-500' },
      { label: 'Activities', amount: 600, color: 'bg-green-500' },
      { label: 'Food', amount: 550, color: 'bg-orange-500' },
      { label: 'Transport', amount: 150, color: 'bg-pink-500' },
      { label: 'Miscellaneous', amount: 200, color: 'bg-yellow-500' },
    ],

    tips: [
      {
        category: 'transport' as const,
        text: 'Buy a Roma Pass for unlimited public transport and free entry to 2 museums. The metro and buses are efficient and affordable.',
      },
      {
        category: 'cultural' as const,
        text: 'Dress modestly when visiting churches and the Vatican - shoulders and knees must be covered. Bring a shawl or scarf just in case.',
      },
      {
        category: 'money' as const,
        text: 'Many smaller restaurants and shops are cash-only. Always carry some euros. ATMs are widely available but may charge fees.',
      },
      {
        category: 'safety' as const,
        text: 'Watch out for pickpockets in crowded tourist areas, especially near the Colosseum and Trevi Fountain. Keep valuables secure.',
      },
      {
        category: 'food' as const,
        text: 'Lunch (pranzo) is typically 12:30-2:30 PM and dinner (cena) starts around 8 PM. Avoid restaurants with photos on the menu near tourist sites.',
      },
      {
        category: 'packing' as const,
        text: 'Bring comfortable walking shoes - you\'ll walk 10+ miles per day on cobblestones. Pack layers as evenings can be cool even in summer.',
      },
    ],
  };

  const totalBudget = 5000;
  const plannedSpending = itineraryData.budgetCategories.reduce((sum, cat) => sum + cat.amount, 0);

  const handleQuickEdit = (dayNumber: number, updatedDay: any) => {
    const updatedDays = itineraryData.days.map(day => day.dayNumber === dayNumber ? updatedDay : day);
    const updatedItineraryData = { ...itineraryData, days: updatedDays };
    setRefinementContext(JSON.stringify(updatedItineraryData));
  };

  const handleItineraryUpdate = (updatedContext: string) => {
    const updatedItineraryData = JSON.parse(updatedContext);
    setRefinementContext(updatedContext);
  };

  // Sharing handlers
  const handleAddCollaborator = (email: string, permission: 'view' | 'edit' | 'suggest') => {
    const newCollaborator = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      initials: email.substring(0, 2).toUpperCase(),
      permission,
    };
    setCollaborators([...collaborators, newCollaborator]);
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
    toast.success('Collaborator removed');
  };

  const handleChangePermission = (id: string, permission: 'view' | 'edit' | 'suggest') => {
    setCollaborators(collaborators.map(c => c.id === id ? { ...c, permission } : c));
    toast.success('Permission updated');
  };

  const handleAddComment = (dayNumber: number, timeSlot: string, text: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: { name: 'Current User', initials: 'CU' },
      text,
      timestamp: 'Just now',
      isOwner: !isSharedTrip,
    };
    
    setComments((prev: any) => ({
      ...prev,
      [dayNumber]: {
        ...prev[dayNumber],
        [timeSlot.toLowerCase()]: [...(prev[dayNumber]?.[timeSlot.toLowerCase()] || []), newComment],
      },
    }));
    
    toast.success('Comment added');
  };

  const handleAcceptSuggestion = (commentId: string) => {
    console.log('Accept suggestion:', commentId);
    toast.success('Suggestion accepted!');
  };

  const handleDismissSuggestion = (commentId: string) => {
    console.log('Dismiss suggestion:', commentId);
    toast.success('Suggestion dismissed');
  };

  const handleSaveCopy = () => {
    console.log('Saving copy of trip');
    toast.success('Trip copied to your trips!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Collaborator Banner */}
      {isSharedTrip && (
        <CollaboratorBanner
          ownerName={tripOwner.name}
          ownerInitials={tripOwner.initials}
          permission={viewerPermission}
          onSaveCopy={handleSaveCopy}
        />
      )}

      <div className={isRefinementOpen ? 'md:mr-[40%] transition-all duration-300' : ''}>
        <ItineraryHero
          title={itineraryData.title}
          dateRange={itineraryData.dateRange}
          travelers={itineraryData.travelers}
          heroImage={itineraryData.heroImage}
        />

        <ItineraryNav />

        <OverviewSection
          description={itineraryData.description}
          inlineImages={itineraryData.inlineImages}
          weather={itineraryData.weather}
          hasWeatherData={true}
        />

        {/* Day by Day Section */}
        <section id="day-by-day" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl mb-8">Day-by-Day Itinerary</h2>
            <div className="space-y-8">
              {itineraryData.days.map((day) => (
                <DayCard
                  key={day.dayNumber}
                  {...day}
                  canEdit={!isSharedTrip || viewerPermission === 'edit'}
                  canSuggest={viewerPermission === 'suggest'}
                  comments={comments[day.dayNumber]}
                  isOwner={!isSharedTrip}
                  onAddComment={(timeSlot, text) => handleAddComment(day.dayNumber, timeSlot, text)}
                  onAcceptSuggestion={handleAcceptSuggestion}
                  onDismissSuggestion={handleDismissSuggestion}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Flights Section */}
        <section id="flights" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl mb-8">Flight Options</h2>
            <div className="space-y-6">
              {itineraryData.flights.map((flight, idx) => (
                <FlightCard key={idx} {...flight} />
              ))}
            </div>
          </div>
        </section>

        {/* Hotels Section */}
        <section id="hotels" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl mb-8">Hotel Recommendations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraryData.hotels.map((hotel, idx) => (
                <HotelCard key={idx} {...hotel} />
              ))}
            </div>
          </div>
        </section>

        <BudgetSection
          totalBudget={totalBudget}
          plannedSpending={plannedSpending}
          categories={itineraryData.budgetCategories}
        />

        <TipsSection tips={itineraryData.tips} />
      </div>

      {/* Floating Refine Button */}
      {!isRefinementOpen && (
        <Button
          onClick={() => setIsRefinementOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl h-14 px-6 rounded-full z-30"
        >
          <MessageCircle className="size-5 mr-2" />
          Refine Itinerary
        </Button>
      )}

      {/* Refinement Chat */}
      <RefinementChat
        isOpen={isRefinementOpen}
        onClose={() => setIsRefinementOpen(false)}
        onUpdate={handleItineraryUpdate}
        initialMessage={refinementContext}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={shareLink}
        publicLinkEnabled={publicLinkEnabled}
        setPublicLinkEnabled={setPublicLinkEnabled}
        collaborators={collaborators}
        setCollaborators={setCollaborators}
        isSharedTrip={isSharedTrip}
        viewerPermission={viewerPermission}
        tripOwner={tripOwner}
        comments={comments}
        setComments={setComments}
        handleAddCollaborator={handleAddCollaborator}
        handleRemoveCollaborator={handleRemoveCollaborator}
        handleChangePermission={handleChangePermission}
        handleAddComment={handleAddComment}
        handleAcceptSuggestion={handleAcceptSuggestion}
        handleDismissSuggestion={handleDismissSuggestion}
        handleSaveCopy={handleSaveCopy}
      />

      {/* Floating Share Button */}
      {!isRefinementOpen && !isSharedTrip && (
        <Button
          onClick={() => setIsShareModalOpen(true)}
          className="fixed bottom-24 right-6 md:bottom-8 md:left-8 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 shadow-xl h-12 px-5 rounded-full z-30"
        >
          <Share2 className="size-4 mr-2" />
          Share
        </Button>
      )}

      {/* Floating Export Button */}
      {!isRefinementOpen && (
        <Button
          onClick={() => navigate('/export')}
          className="fixed bottom-24 right-6 md:bottom-24 md:left-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl h-12 px-5 rounded-full z-30"
        >
          <Download className="size-4 mr-2" />
          Export
        </Button>
      )}
    </div>
  );
}