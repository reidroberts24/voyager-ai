import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

const TRAVEL_FACTS = [
  "Did you know? Rome has more than 2,000 fountains!",
  "Travel tip: Book flights on Tuesday afternoons for the best deals.",
  "Fun fact: The world's oldest hotel has been operating since 705 AD in Japan.",
  "Did you know? There are more than 195 countries in the world to explore.",
  "Travel tip: Wednesday is typically the cheapest day to fly domestically.",
  "Fun fact: France is the world's most visited country with 89 million tourists annually.",
  "Did you know? The shortest commercial flight lasts just 57 seconds between two Scottish islands.",
  "Travel tip: Download offline maps before traveling to save on roaming charges.",
];

export function TravelFacts() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % TRAVEL_FACTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
            <Lightbulb className="size-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p
            key={currentFactIndex}
            className="text-gray-700 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            {TRAVEL_FACTS[currentFactIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
