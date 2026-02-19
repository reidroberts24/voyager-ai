import { MessageCircle, Search, Calendar } from 'lucide-react';

const STEPS = [
  {
    icon: MessageCircle,
    title: 'Tell us about your dream trip',
    description: 'Share your preferences, budget, and travel style through our conversational AI interface.',
  },
  {
    icon: Search,
    title: 'AI agents research flights, hotels & activities',
    description: 'Our intelligent agents scour the web to find the best options tailored to your needs.',
  },
  {
    icon: Calendar,
    title: 'Get a complete day-by-day itinerary',
    description: 'Receive a personalized itinerary with bookings, reservations, and recommendations.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Three simple steps to your perfect trip</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl">
                    <Icon className="size-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-2 border-blue-600 rounded-full size-8 flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
