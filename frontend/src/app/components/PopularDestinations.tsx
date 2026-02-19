import { DestinationCard } from './common/DestinationCard';

const DESTINATIONS = [
  {
    name: 'Paris',
    price: '$1,299',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEVpZmZlbCUyMFRvd2VyfGVufDF8fHx8MTc3MTIzMjk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Bali',
    price: '$899',
    image: 'https://images.unsplash.com/photo-1656247203824-3d6f99461ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWxpJTIwcmljZSUyMHRlcnJhY2VzfGVufDF8fHx8MTc3MTI3MDM2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'New York',
    price: '$1,599',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXclMjBZb3JrJTIwQ2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzcxMjYwNjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Iceland',
    price: '$1,799',
    image: 'https://images.unsplash.com/photo-1488415032361-b7e238421f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJY2VsYW5kJTIwbm9ydGhlcm4lMjBsaWdodHN8ZW58MXx8fHwxNzcxMjg1NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Dubai',
    price: '$1,499',
    image: 'https://images.unsplash.com/photo-1726533765275-a69cfd7f9897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcxMzAwMjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Barcelona',
    price: '$1,199',
    image: 'https://images.unsplash.com/photo-1741304787559-a392853b613b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmElMjBhcmNoaXRlY3R1cmUlMjBHYXVkaXxlbnwxfHx8fDE3NzEzMDAyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Thailand',
    price: '$799',
    image: 'https://images.unsplash.com/photo-1639491146900-8c892c0f6875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMGJlYWNoJTIwdHJvcGljYWx8ZW58MXx8fHwxNzcxMjM5MDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Santorini',
    price: '$1,399',
    image: 'https://images.unsplash.com/photo-1672622851784-0dbd3df4c088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW50b3JpbmklMjBzdW5zZXQlMjB3aGl0ZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NzEzMDAyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

interface PopularDestinationsProps {
  onDestinationClick?: (name: string) => void;
}

export function PopularDestinations({ onDestinationClick }: PopularDestinationsProps) {
  const handleDestinationClick = (name: string) => {
    if (onDestinationClick) {
      onDestinationClick(name);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Popular Destinations</h2>
          <p className="text-xl text-gray-600">Explore our most loved travel spots</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {DESTINATIONS.map((destination) => (
            <DestinationCard
              key={destination.name}
              {...destination}
              onClick={() => handleDestinationClick(destination.name)}
            />
          ))}
        </div>

        {/* Mobile: Horizontal scroll alternative */}
        <div className="sm:hidden overflow-x-auto -mx-4 px-4 pb-4">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {DESTINATIONS.map((destination) => (
              <div key={destination.name} className="w-64">
                <DestinationCard
                  {...destination}
                  onClick={() => handleDestinationClick(destination.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}