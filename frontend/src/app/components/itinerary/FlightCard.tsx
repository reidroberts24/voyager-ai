import { Plane, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Flight {
  origin: string;
  destination: string;
  airline: string;
  airlineLogo?: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
}

interface FlightCardProps {
  outbound: Flight;
  return: Flight;
  pricePerPerson: number;
  totalPrice: number;
  isRecommended?: boolean;
  isConfirmed?: boolean;
}

export function FlightCard({
  outbound,
  return: returnFlight,
  pricePerPerson,
  totalPrice,
  isRecommended,
  isConfirmed,
}: FlightCardProps) {
  const FlightRow = ({ flight, label }: { flight: Flight; label: string }) => (
    <div className="py-4">
      <p className="text-sm text-gray-600 mb-3">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-medium">{flight.departure}</p>
              <p className="text-sm text-gray-600">{flight.origin}</p>
            </div>
            <div className="flex-1 px-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-px flex-1 bg-gray-300" />
                <Plane className="size-5 text-gray-400" />
                <div className="h-px flex-1 bg-gray-300" />
              </div>
              <div className="text-center text-sm text-gray-600">
                <p>{flight.duration}</p>
                <p>{flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-medium">{flight.arrival}</p>
              <p className="text-sm text-gray-600">{flight.destination}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{flight.airline}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
      {isRecommended && (
        <Badge className="absolute top-4 right-4 bg-green-600">
          Recommended
        </Badge>
      )}
      {isConfirmed && (
        <Badge className="absolute top-4 right-4 bg-blue-600">
          Confirmed
        </Badge>
      )}

      <FlightRow flight={outbound} label="Outbound" />
      <div className="border-t border-gray-200" />
      <FlightRow flight={returnFlight} label="Return" />

      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Per person</p>
          <p className="text-3xl font-medium text-gray-900">${pricePerPerson}</p>
          <p className="text-sm text-gray-600">Total: ${totalPrice}</p>
        </div>
        {!isConfirmed && (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Select Flight
          </Button>
        )}
      </div>
    </div>
  );
}
