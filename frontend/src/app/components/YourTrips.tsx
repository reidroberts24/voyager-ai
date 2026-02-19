import { Calendar, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';

const USER_TRIPS = [
  {
    id: 1,
    title: 'Weekend Getaway to Paris',
    destination: 'Paris, France',
    dates: 'Mar 15-17, 2026',
    status: 'Planning',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEVpZmZlbCUyMFRvd2VyfGVufDF8fHx8MTc3MTIzMjk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    progress: 60,
  },
  {
    id: 2,
    title: 'Summer in Bali',
    destination: 'Bali, Indonesia',
    dates: 'Jun 1-14, 2026',
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1656247203824-3d6f99461ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWxpJTIwcmljZSUyMHRlcnJhY2VzfGVufDF8fHx8MTc3MTI3MDM2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    progress: 20,
  },
  {
    id: 3,
    title: 'Christmas in New York',
    destination: 'New York City, USA',
    dates: 'Dec 20-27, 2025',
    status: 'Complete',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXclMjBZb3JrJTIwQ2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzcxMjYwNjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    progress: 100,
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Complete':
      return 'default';
    case 'Planning':
      return 'secondary';
    case 'Draft':
      return 'outline';
    default:
      return 'outline';
  }
};

export function YourTrips() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Your Trips</h2>
          <p className="text-xl text-gray-600">Continue planning your adventures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USER_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group border border-gray-200"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={getStatusVariant(trip.status)} className="bg-white/95 backdrop-blur-sm">
                    {trip.status}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg mb-3">{trip.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="size-4" />
                  <span className="text-sm">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar className="size-4" />
                  <span className="text-sm">{trip.dates}</span>
                </div>
                
                {trip.status !== 'Complete' && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{trip.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
