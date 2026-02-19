import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { Send, Paperclip, Mic, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ChatMessage } from '../components/planning/ChatMessage';
import { TypingIndicator } from '../components/planning/TypingIndicator';
import { TripSummaryPanel, TripDetails } from '../components/planning/TripSummaryPanel';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  timestamp: string;
}

export default function TripPlanning() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tripDetails, setTripDetails] = useState<TripDetails>({});
  const [contextHint, setContextHint] = useState('Tell me your dates, budget, and interests...');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Start conversation with welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI travel agent. I'll help you plan the perfect trip. Where would you like to go?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMessage]);

    // Auto-send initialQuery as a user message after welcome loads
    let userTimer: ReturnType<typeof setTimeout>;
    let aiTimer: ReturnType<typeof setTimeout>;

    if (initialQuery) {
      userTimer = setTimeout(() => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: initialQuery,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        aiTimer = setTimeout(() => {
          setTripDetails((prev) => ({ ...prev, destination: initialQuery }));
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              type: 'ai',
              content: `Perfect! I'd love to help you explore ${initialQuery}. When are you planning to travel?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsTyping(false);
          setContextHint('Provide your travel dates...');
        }, 1500);
      }, 600);
    }

    return () => {
      clearTimeout(userTimer);
      clearTimeout(aiTimer);
    };
  }, [initialQuery]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      let aiResponse = '';
      let suggestions: string[] | undefined;
      const newTripDetails = { ...tripDetails };

      // Simple conversation flow logic
      if (!tripDetails.destination) {
        aiResponse = "Perfect! I'd love to help you explore that destination. When are you planning to travel?";
        newTripDetails.destination = userMessage;
        setContextHint('Provide your travel dates...');
      } else if (!tripDetails.dates) {
        aiResponse = "Great! How many people will be traveling?";
        newTripDetails.dates = {
          departure: 'Mar 15, 2026',
          return: 'Mar 22, 2026',
        };
        setContextHint('Tell me about your travel companions...');
      } else if (!tripDetails.travelers) {
        const count = parseInt(userMessage) || 2;
        aiResponse = "Excellent! Where will you be departing from?";
        newTripDetails.travelers = count;
        setContextHint('Your departure city...');
      } else if (!tripDetails.origin) {
        aiResponse = "Perfect! What's your approximate budget for this trip?";
        newTripDetails.origin = userMessage;
        setContextHint('Total budget for flights, hotels, activities...');
      } else if (!tripDetails.budget) {
        aiResponse = "Great! What are your main interests for this trip?";
        suggestions = ['History', 'Food & Cuisine', 'Art & Culture', 'Adventure', 'Beaches', 'Shopping'];
        newTripDetails.budget = {
          total: 3000,
          flights: 800,
          hotels: 1200,
          activities: 600,
          food: 400,
        };
        setContextHint('Select your interests or type your own...');
      } else if (!tripDetails.interests || tripDetails.interests.length === 0) {
        const interests = userMessage.split(',').map(i => i.trim());
        aiResponse = "Perfect! I have all the information I need. Based on your preferences, I'll create a personalized itinerary for your trip. Click 'Start Planning' to begin!";
        newTripDetails.interests = interests;
        setContextHint('Ready to start planning your trip!');
      } else {
        aiResponse = "I'm here to help! Feel free to ask me anything about your trip or click 'Start Planning' to continue.";
      }

      setTripDetails(newTripDetails);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: aiResponse,
          suggestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    simulateAIResponse(inputValue);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    simulateAIResponse(suggestion);
  };

  const handleStartPlanning = () => {
    console.log('Starting trip planning with details:', tripDetails);
    // This would navigate to the itinerary/results page
    navigate('/research', { state: { tripDetails } });
  };

  const canStartPlanning = !!(
    tripDetails.destination &&
    tripDetails.dates &&
    tripDetails.travelers &&
    tripDetails.origin &&
    tripDetails.budget
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="md:hidden"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Send className="size-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">Trip Planning</h1>
            <p className="text-sm text-gray-600">Voyager AI Assistant</p>
          </div>
        </div>

        {/* Mobile: Summary sheet trigger */}
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4">
            Summary
            <ChevronDown className="size-4" />
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <div className="overflow-y-auto h-full py-6">
              <TripSummaryPanel
                tripDetails={tripDetails}
                onStartPlanning={handleStartPlanning}
                canStartPlanning={canStartPlanning}
              />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col md:w-[60%]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  suggestions={message.suggestions}
                  onSuggestionClick={handleSuggestionClick}
                  timestamp={message.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 mb-3 text-center">{contextHint}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
                  <Paperclip className="size-5" />
                </Button>
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
                  <Mic className="size-5" />
                </Button>
                <Button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0"
                >
                  <Send className="size-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Trip Summary Panel - Desktop */}
        <div className="hidden md:block w-[40%] border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 sticky top-0">
            <TripSummaryPanel
              tripDetails={tripDetails}
              onStartPlanning={handleStartPlanning}
              canStartPlanning={canStartPlanning}
            />
          </div>
        </div>
      </div>

      {/* Mobile: Sticky Start Planning Button */}
      {canStartPlanning && (
        <div className="md:hidden border-t border-gray-200 bg-white p-4">
          <Button
            onClick={handleStartPlanning}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
          >
            Start Planning
          </Button>
        </div>
      )}
    </div>
  );
}