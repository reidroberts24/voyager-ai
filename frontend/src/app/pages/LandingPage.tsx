import { useState } from 'react';
import { useNavigate } from 'react-router';
import { NavigationBar } from '../components/layout/NavigationBar';
import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';
import { PopularDestinations } from '../components/PopularDestinations';
import { RecentTrips } from '../components/RecentTrips';
import { YourTrips } from '../components/YourTrips';
import { Footer } from '../components/layout/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleStartPlanning = (query?: string) => {
    if (query) {
      navigate(`/plan?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/plan');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar isLoggedIn={isLoggedIn} />
      <main>
        <HeroSection onStartPlanning={handleStartPlanning} />
        <HowItWorks />
        <PopularDestinations onDestinationClick={(dest) => handleStartPlanning(dest)} />
        <RecentTrips />
        {isLoggedIn && <YourTrips />}
      </main>
      <Footer />
    </div>
  );
}