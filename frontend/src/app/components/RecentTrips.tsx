import { Clock, MapPin } from 'lucide-react';

const COMMUNITY_TRIPS = [
  {
    id: 1,
    title: 'European Summer Adventure',
    destination: 'Paris → Rome → Barcelona',
    duration: '14 days',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEVpZmZlbCUyMFRvd2VyfGVufDF8fHx8MTc3MTIzMjk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    traveler: 'Sarah M.',
  },
  {
    id: 2,
    title: 'Island Hopping in Southeast Asia',
    destination: 'Thailand → Bali → Vietnam',
    duration: '21 days',
    image: 'https://images.unsplash.com/photo-1639491146900-8c892c0f6875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMGJlYWNoJTIwdHJvcGljYWx8ZW58MXx8fHwxNzcxMjM5MDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    traveler: 'Mike R.',
  },
  {
    id: 3,
    title: 'Northern Lights Experience',
    destination: 'Reykjavik, Iceland',
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1488415032361-b7e238421f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJY2VsYW5kJTIwbm9ydGhlcm4lMjBsaWdodHN8ZW58MXx8fHwxNzcxMjg1NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    traveler: 'Emma L.',
  },
  {
    id: 4,
    title: 'Tokyo Food & Culture Tour',
    destination: 'Tokyo, Japan',
    duration: '10 days',
    image: 'https://images.unsplash.com/photo-1730385835399-4d0f24898919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMG5pZ2h0JTIwbmVvbiUyMHN0cmVldHN8ZW58MXx8fHwxNzcxMzAwMjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    traveler: 'Alex K.',
  },
];

export function RecentTrips() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Recent Trips by Our Community</h2>
          <p className="text-xl text-gray-600">Get inspired by other travelers' adventures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMUNITY_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg mb-2 line-clamp-1">{trip.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="size-4" />
                  <span className="text-sm line-clamp-1">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Clock className="size-4" />
                  <span className="text-sm">{trip.duration}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <img
                    src={trip.avatar}
                    alt={trip.traveler}
                    className="size-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600">{trip.traveler}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
