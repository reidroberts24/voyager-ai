import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Plane, Hotel, Compass, Cloud, Globe, FileText } from 'lucide-react';
import { AgentRow, AgentStatus } from '../components/research/AgentRow';
import { TravelFacts } from '../components/research/TravelFacts';

interface AgentData {
  id: string;
  icon: typeof Plane;
  label: string;
  status: AgentStatus;
  result?: string;
  duration: number; // Simulated duration in milliseconds
}

export default function TripResearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const tripDetails = location.state?.tripDetails || {
    destination: 'Rome',
    dates: { departure: 'Mar 15, 2026', return: 'Mar 20, 2026' },
  };

  const [agents, setAgents] = useState<AgentData[]>([
    {
      id: 'flights',
      icon: Plane,
      label: 'Searching flights...',
      status: 'pending',
      duration: 3000,
    },
    {
      id: 'hotels',
      icon: Hotel,
      label: 'Finding hotels...',
      status: 'pending',
      duration: 4000,
    },
    {
      id: 'activities',
      icon: Compass,
      label: 'Discovering activities...',
      status: 'pending',
      duration: 5000,
    },
    {
      id: 'weather',
      icon: Cloud,
      label: 'Checking weather...',
      status: 'pending',
      duration: 2500,
    },
    {
      id: 'destination',
      icon: Globe,
      label: 'Researching destination...',
      status: 'pending',
      duration: 3500,
    },
  ]);

  const [progress, setProgress] = useState(0);
  const [isAssembling, setIsAssembling] = useState(false);
  const [statusText, setStatusText] = useState('Starting research...');

  const backgroundImage = 'https://images.unsplash.com/photo-1622492310648-2ddb1b1e7e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21lJTIwQ29sb3NzZXVtJTIwYW5jaWVudCUyMGNpdHl8ZW58MXx8fHwxNzcxMzAwNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

  useEffect(() => {
    // Start all agents with slight delays
    agents.forEach((agent, index) => {
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === agent.id ? { ...a, status: 'running' } : a
          )
        );
        setStatusText('Researching your trip...');

        // Complete agent after its duration
        setTimeout(() => {
          const results: { [key: string]: string } = {
            flights: 'Found 5 flights from $926/person',
            hotels: 'Found 12 hotels from $150/night',
            activities: 'Curated 24 experiences and tours',
            weather: 'Sunny, 18-22°C throughout your stay',
            destination: 'Compiled local tips and hidden gems',
          };

          setAgents((prev) =>
            prev.map((a) =>
              a.id === agent.id
                ? { ...a, status: 'complete', result: results[agent.id] }
                : a
            )
          );

          // Update progress
          setProgress((prev) => prev + 20);
        }, agent.duration);
      }, index * 500);
    });
  }, []);

  useEffect(() => {
    // Check if all agents are complete
    const allComplete = agents.every((a) => a.status === 'complete');
    
    if (allComplete && !isAssembling) {
      setStatusText('Almost there...');
      setTimeout(() => {
        setIsAssembling(true);
        setStatusText('Our AI writer is crafting your perfect itinerary...');
        
        // Navigate to itinerary after assembly
        setTimeout(() => {
          // navigate('/itinerary', { state: { tripDetails } });
          navigate('/itinerary', { state: { tripDetails } });
        }, 3000);
      }, 500);
    }
  }, [agents, isAssembling, navigate, tripDetails]);

  const getDayCount = () => {
    if (!tripDetails.dates) return 5;
    // Simple calculation - in real app would use date library
    return 5;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt={tripDetails.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Trip Title */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
            <h1 className="text-4xl md:text-5xl text-white mb-2">
              Planning your {getDayCount()} days in {tripDetails.destination}...
            </h1>
            <p className="text-xl text-white/80">{statusText}</p>
          </div>

          {!isAssembling ? (
            <>
              {/* Agent Rows */}
              <div className="space-y-3 mb-6">
                {agents.map((agent) => (
                  <AgentRow
                    key={agent.id}
                    icon={agent.icon}
                    label={agent.label}
                    status={agent.status}
                    result={agent.result}
                  />
                ))}
              </div>

              {/* Travel Facts */}
              <TravelFacts />
            </>
          ) : (
            /* Assembly Phase */
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 animate-in zoom-in duration-500">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl animate-pulse">
                  <FileText className="size-16 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl text-gray-900 mb-2">
                    Crafting Your Perfect Itinerary
                  </h2>
                  <p className="text-gray-700">
                    Our AI writer is assembling your personalized day-by-day plan...
                  </p>
                </div>
                
                {/* Typewriter Effect Simulation */}
                <div className="w-full bg-white/70 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                    <div className="h-2 bg-gray-300 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" style={{ width: '80%', animationDelay: '200ms' }} />
                    <div className="h-2 bg-gray-300 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" style={{ width: '50%', animationDelay: '400ms' }} />
                    <div className="h-2 bg-gray-300 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Time */}
          <div className="text-center mt-6">
            <p className="text-white/70 text-sm">
              {progress < 100 ? 'This usually takes 10-15 seconds...' : 'Almost done!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}