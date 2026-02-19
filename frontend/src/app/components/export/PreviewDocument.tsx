import { Calendar, MapPin, Users, Plane, Hotel, DollarSign, Lightbulb, CloudRain } from 'lucide-react';

interface PreviewDocumentProps {
  tripData: {
    title: string;
    destination: string;
    dateRange: string;
    travelers: number;
    heroImage: string;
    days: any[];
    flights?: any[];
    hotels?: any[];
    budget?: any;
    tips?: string[];
  };
  includedSections: {
    flights: boolean;
    hotels: boolean;
    weather: boolean;
    budget: boolean;
    tips: boolean;
    rainPlans: boolean;
  };
}

export function PreviewDocument({ tripData, includedSections }: PreviewDocumentProps) {
  return (
    <div className="bg-white shadow-2xl mx-auto" style={{ width: '8.5in', minHeight: '11in' }}>
      {/* Cover Page */}
      <div className="relative h-screen flex flex-col justify-end p-12 bg-gradient-to-b from-transparent to-black/60">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${tripData.heroImage})` }}
        />
        <div className="relative z-10 text-white">
          <h1 className="text-6xl font-bold mb-4">{tripData.title}</h1>
          <div className="flex items-center gap-6 text-xl mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="size-6" />
              <span>{tripData.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-6" />
              <span>{tripData.dateRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span>{tripData.travelers} travelers</span>
            </div>
          </div>
          <p className="text-lg opacity-90">Created with Voyager AI</p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="p-12 page-break">
        <h2 className="text-4xl font-bold mb-8 border-b-2 border-gray-300 pb-4">
          Table of Contents
        </h2>
        <div className="space-y-3 text-lg">
          <div className="flex justify-between hover:bg-gray-50 p-2 rounded">
            <span>Overview</span>
            <span className="text-gray-500">3</span>
          </div>
          <div className="flex justify-between hover:bg-gray-50 p-2 rounded">
            <span>Day-by-Day Itinerary</span>
            <span className="text-gray-500">4</span>
          </div>
          {includedSections.flights && (
            <div className="flex justify-between hover:bg-gray-50 p-2 rounded">
              <span>Flights</span>
              <span className="text-gray-500">10</span>
            </div>
          )}
          {includedSections.hotels && (
            <div className="flex justify-between hover:bg-gray-50 p-2 rounded">
              <span>Accommodations</span>
              <span className="text-gray-500">11</span>
            </div>
          )}
          {includedSections.budget && (
            <div className="flex justify-between hover:bg-gray-50 p-2 rounded">
              <span>Budget Breakdown</span>
              <span className="text-gray-500">12</span>
            </div>
          )}
          {includedSections.tips && (
            <div className="flex justify-between hover:bg-gray-50 p-2 rounded">
              <span>Travel Tips</span>
              <span className="text-gray-500">13</span>
            </div>
          )}
        </div>
      </div>

      {/* Overview */}
      <div className="p-12 page-break">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">Overview</h2>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            Welcome to your personalized {tripData.title} itinerary! This carefully crafted 
            journey will take you through the best experiences {tripData.destination} has to offer.
          </p>
          
          {includedSections.weather && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Calendar className="size-5" />
                Weather Forecast
              </h3>
              <div className="flex gap-4">
                {[
                  { day: 'Day 1', temp: '28°C', icon: '☀️' },
                  { day: 'Day 2', temp: '29°C', icon: '☀️' },
                  { day: 'Day 3', temp: '26°C', icon: '⛅' },
                  { day: 'Day 4', temp: '27°C', icon: '☀️' },
                  { day: 'Day 5', temp: '28°C', icon: '☀️' },
                ].map((w, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl mb-1">{w.icon}</div>
                    <div className="text-sm font-medium">{w.day}</div>
                    <div className="text-sm text-gray-600">{w.temp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Day-by-Day Itinerary */}
      {tripData.days.map((day, index) => (
        <div key={index} className="p-12 page-break">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {day.dayNumber}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{day.title}</h2>
                <p className="text-gray-600">{day.date}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Morning */}
            <div className="border-l-4 border-yellow-500 pl-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                🌅 Morning • {day.morning.time}
              </h3>
              <p className="text-gray-700 leading-relaxed">{day.morning.description}</p>
              {day.morning.cost && (
                <p className="text-sm text-gray-600 mt-2">💰 Estimated cost: ${day.morning.cost}</p>
              )}
            </div>

            {/* Afternoon */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                ☀️ Afternoon • {day.afternoon.time}
              </h3>
              <p className="text-gray-700 leading-relaxed">{day.afternoon.description}</p>
              {day.afternoon.cost && (
                <p className="text-sm text-gray-600 mt-2">💰 Estimated cost: ${day.afternoon.cost}</p>
              )}
            </div>

            {/* Evening */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                🌙 Evening • {day.evening.time}
              </h3>
              <p className="text-gray-700 leading-relaxed">{day.evening.description}</p>
              {day.evening.cost && (
                <p className="text-sm text-gray-600 mt-2">💰 Estimated cost: ${day.evening.cost}</p>
              )}
            </div>

            {/* Rain Plans */}
            {includedSections.rainPlans && day.rainPlan && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CloudRain className="size-4" />
                  Backup Plans (if it rains)
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Morning: {day.rainPlan.morning}</p>
                  <p>• Afternoon: {day.rainPlan.afternoon}</p>
                  <p>• Evening: {day.rainPlan.evening}</p>
                </div>
              </div>
            )}

            {/* Daily Total */}
            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
              <span className="font-semibold">Daily Total:</span>
              <span className="text-2xl font-bold text-blue-600">${day.totalCost}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Flights Section */}
      {includedSections.flights && tripData.flights && (
        <div className="p-12 page-break">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <Plane className="size-8" />
            Flight Details
          </h2>
          <div className="space-y-4">
            {tripData.flights.map((flight: any, index: number) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{flight.airline} {flight.flightNumber}</h3>
                    <p className="text-gray-600">{flight.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
                    <p className="text-sm text-gray-600">{flight.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold">{flight.departure.time}</p>
                    <p className="text-gray-600">{flight.departure.airport}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-px bg-gray-300 flex-1" />
                    <Plane className="size-4 text-gray-400" />
                    <div className="h-px bg-gray-300 flex-1" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{flight.arrival.time}</p>
                    <p className="text-gray-600">{flight.arrival.airport}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotels Section */}
      {includedSections.hotels && tripData.hotels && (
        <div className="p-12 page-break">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <Hotel className="size-8" />
            Accommodations
          </h2>
          <div className="space-y-4">
            {tripData.hotels.map((hotel: any, index: number) => (
              <div key={index} className="border border-gray-300 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{hotel.name}</h3>
                    <p className="text-gray-600">{hotel.address}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Check-in: {hotel.checkIn} • Check-out: {hotel.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${hotel.totalPrice}</p>
                    <p className="text-sm text-gray-600">{hotel.nights} nights</p>
                    <p className="text-sm text-gray-500">${hotel.pricePerNight}/night</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Section */}
      {includedSections.budget && tripData.budget && (
        <div className="p-12 page-break">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <DollarSign className="size-8" />
            Budget Breakdown
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3">Category</th>
                    <th className="text-right py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Flights</td>
                    <td className="text-right">${tripData.budget.flights}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Hotels</td>
                    <td className="text-right">${tripData.budget.hotels}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Activities</td>
                    <td className="text-right">${tripData.budget.activities}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Food & Dining</td>
                    <td className="text-right">${tripData.budget.food}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Transportation</td>
                    <td className="text-right">${tripData.budget.transport}</td>
                  </tr>
                  <tr className="font-bold text-lg">
                    <td className="py-4">Total</td>
                    <td className="text-right text-blue-600">${tripData.budget.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {includedSections.tips && tripData.tips && (
        <div className="p-12 page-break">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <Lightbulb className="size-8" />
            Travel Tips
          </h2>
          <div className="space-y-4">
            {tripData.tips.map((tip: string, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed flex-1">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
