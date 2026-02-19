import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChatMessage } from '../planning/ChatMessage';
import { TypingIndicator } from '../planning/TypingIndicator';
import { AlternativeCard } from './AlternativeCard';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  alternatives?: Array<{
    name: string;
    description: string;
    cost: number;
    time?: string;
    location?: string;
    image?: string;
  }>;
  timestamp: string;
}

interface RefinementChatProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (update: any) => void;
  initialMessage?: string;
}

export function RefinementChat({ isOpen, onClose, onUpdate, initialMessage }: RefinementChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMoreAlternatives, setShowMoreAlternatives] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: initialMessage || "Your itinerary is ready! Want to make any changes? You can ask me to swap activities, adjust the budget, change hotels, or anything else.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, initialMessage]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      let aiResponse = '';
      let alternatives;

      // Detect intent and respond accordingly
      if (lowerMessage.includes('cheaper') || lowerMessage.includes('budget')) {
        aiResponse = "I found 3 more affordable hotel options for you. All are well-reviewed and in great locations:";
        alternatives = [
          {
            name: 'Hotel Raffaello',
            description: 'Charming 3-star hotel near Termini Station with excellent breakfast and rooftop terrace.',
            cost: 120,
            location: 'Esquilino',
          },
          {
            name: 'Hotel Lancelot',
            description: 'Family-run hotel near the Colosseum with spacious rooms and friendly service.',
            cost: 135,
            location: 'Celio',
          },
          {
            name: 'Hotel Giotto',
            description: 'Modern hotel in Prati neighborhood, walking distance to Vatican and great restaurants.',
            cost: 128,
            location: 'Prati',
          },
        ];
      } else if (lowerMessage.includes('cooking') || lowerMessage.includes('class')) {
        aiResponse = "Great idea! I can add a cooking class to your itinerary. Here are 3 popular options:";
        alternatives = [
          {
            name: 'Traditional Roman Cooking Class',
            description: 'Learn to make authentic Cacio e Pepe, Carbonara, and Tiramisu with a local chef in Trastevere.',
            cost: 89,
            time: '3 hours',
            location: 'Trastevere',
          },
          {
            name: 'Market Tour & Cooking Experience',
            description: 'Shop at Campo de\' Fiori market, then cook a 4-course meal with fresh ingredients.',
            cost: 125,
            time: '5 hours',
            location: 'Centro Storico',
          },
          {
            name: 'Pizza Making Workshop',
            description: 'Master the art of Neapolitan pizza making, including dough tossing and wood-fired baking.',
            cost: 75,
            time: '2.5 hours',
            location: 'Testaccio',
          },
        ];
      } else if (lowerMessage.includes('vatican') || lowerMessage.includes('move')) {
        aiResponse = "I can move the Vatican visit to Day 3. This would swap it with the Baroque Rome & Fountains activities. Would you like me to make this change?";
      } else if (lowerMessage.includes('swap') || lowerMessage.includes('alternative')) {
        aiResponse = "I can help you find alternatives! Here are 3 different options for that time slot:";
        alternatives = [
          {
            name: 'Borghese Gallery & Gardens',
            description: 'Explore one of Rome\'s finest art galleries with works by Bernini and Caravaggio, then stroll the beautiful gardens.',
            cost: 55,
            time: '3 hours',
            location: 'Villa Borghese',
          },
          {
            name: 'Appian Way Bike Tour',
            description: 'Cycle along the ancient Appian Way, visiting catacombs and Roman ruins on this scenic route.',
            cost: 65,
            time: '4 hours',
            location: 'Via Appia Antica',
          },
          {
            name: 'Food Tour in Testaccio',
            description: 'Discover Rome\'s authentic food scene in the local Testaccio neighborhood with 8+ tastings.',
            cost: 79,
            time: '3.5 hours',
            location: 'Testaccio',
          },
        ];
      } else {
        aiResponse = "I can help you with that! Let me know what specific changes you'd like to make to your itinerary.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: aiResponse,
          alternatives,
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

  const handleChooseAlternative = (alternative: any, index: number) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `I'll choose option ${index + 1}: ${alternative.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    setTimeout(() => {
      const confirmMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Perfect! I've updated your itinerary with "${alternative.name}". You can see the changes reflected in your day-by-day plan. Is there anything else you'd like to adjust?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, confirmMessage]);
      setIsTyping(false);

      // Notify parent component of the update
      if (onUpdate) {
        onUpdate({ type: 'activity', data: alternative });
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop: Side Panel */}
      <div className="hidden md:block">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-300"
          onClick={onClose}
        />

        {/* Chat Panel */}
        <div className="fixed top-0 right-0 bottom-0 w-[40%] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Refine Your Itinerary</h2>
                <p className="text-sm text-gray-600">Ask me to make changes</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage
                  type={message.type}
                  content={message.content}
                  timestamp={message.timestamp}
                />
                
                {/* Alternatives */}
                {message.alternatives && (
                  <div className="ml-12 mt-4 space-y-3 mb-4">
                    {message.alternatives.slice(0, showMoreAlternatives ? undefined : 3).map((alt, idx) => (
                      <AlternativeCard
                        key={idx}
                        number={idx + 1}
                        name={alt.name}
                        description={alt.description}
                        cost={alt.cost}
                        time={alt.time}
                        location={alt.location}
                        image={alt.image}
                        onChoose={() => handleChooseAlternative(alt, idx)}
                      />
                    ))}
                    
                    {message.alternatives.length > 3 && !showMoreAlternatives && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowMoreAlternatives(true)}
                      >
                        Show More Options
                        <ChevronDown className="size-4 ml-2" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full text-gray-600"
                      onClick={() => {
                        const skipMessage: Message = {
                          id: Date.now().toString(),
                          type: 'user',
                          content: "Actually, let me think about it",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        };
                        setMessages((prev) => [...prev, skipMessage]);
                      }}
                    >
                      Skip for now
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask me to make changes..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Full Screen Overlay */}
      <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Refine Itinerary</h2>
              <p className="text-sm text-gray-600">Make changes</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Drag Handle */}
        <div className="flex justify-center py-2 border-b border-gray-200">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
              />
              
              {message.alternatives && (
                <div className="mt-4 space-y-3 mb-4">
                  {message.alternatives.slice(0, showMoreAlternatives ? undefined : 3).map((alt, idx) => (
                    <AlternativeCard
                      key={idx}
                      number={idx + 1}
                      name={alt.name}
                      description={alt.description}
                      cost={alt.cost}
                      time={alt.time}
                      location={alt.location}
                      image={alt.image}
                      onChoose={() => handleChooseAlternative(alt, idx)}
                    />
                  ))}
                  
                  {message.alternatives.length > 3 && !showMoreAlternatives && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowMoreAlternatives(true)}
                    >
                      Show More Options
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full text-gray-600"
                    onClick={() => {
                      const skipMessage: Message = {
                        id: Date.now().toString(),
                        type: 'user',
                        content: "Actually, let me think about it",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      };
                      setMessages((prev) => [...prev, skipMessage]);
                    }}
                  >
                    Skip for now
                  </Button>
                </div>
              )}
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask me to make changes..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
