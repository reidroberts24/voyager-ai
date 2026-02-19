import { Link } from 'react-router';
import { Plane, Luggage } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  filter: string;
}

export function EmptyState({ filter }: EmptyStateProps) {
  const messages = {
    all: {
      title: 'No trips yet!',
      description: 'Start planning your first adventure',
    },
    upcoming: {
      title: 'No upcoming trips',
      description: 'Plan a new trip to see it here',
    },
    past: {
      title: 'No past trips',
      description: 'Your completed trips will appear here',
    },
    drafts: {
      title: 'No draft trips',
      description: 'Save trip ideas as drafts to continue later',
    },
    shared: {
      title: 'No shared trips',
      description: 'Trips shared with you by others will appear here',
    },
  };

  const message = messages[filter as keyof typeof messages] || messages.all;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="size-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <Luggage className="size-16 text-blue-600" />
        </div>
        <div className="absolute -top-2 -right-2 size-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <Plane className="size-6 text-purple-600" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-2xl font-medium text-gray-900 mb-2">
        {message.title}
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {message.description}
      </p>

      {/* CTA */}
      <Button
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        size="lg"
        asChild
      >
        <Link to="/plan">
          <Plane className="size-5 mr-2" />
          Plan a Trip
        </Link>
      </Button>
    </div>
  );
}
