import {
  MapPin,
  Calendar,
  Users,
  Plane,
  DollarSign,
  Tag,
  Check,
  ArrowRight,
  Hotel,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export interface TripDetails {
  destination?: string;
  dates?: {
    departure: string;
    return: string;
  };
  travelers?: number;
  origin?: string;
  budget?: {
    total: number;
    flights: number;
    hotels: number;
    activities: number;
    food: number;
  };
  interests?: string[];
  tripType?: 'round-trip' | 'one-way' | 'multi-city';
  multiCityRoute?: Array<{
    city: string;
    dates: string;
  }>;
  preBooked?: Array<{
    type: 'flight' | 'hotel';
    details: string;
  }>;
}

interface TripSummaryPanelProps {
  tripDetails: TripDetails;
  onStartPlanning?: () => void;
  canStartPlanning: boolean;
}

export function TripSummaryPanel({ tripDetails, onStartPlanning, canStartPlanning }: TripSummaryPanelProps) {
  const SummaryItem = ({
    icon: Icon,
    label,
    value,
    confirmed,
  }: {
    icon: any;
    label: string;
    value?: string | number;
    confirmed: boolean;
  }) => (
    <div className={`flex items-start gap-3 ${confirmed ? '' : 'opacity-40'}`}>
      <div className="mt-0.5">
        <Icon className="size-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className={`${confirmed ? 'text-gray-900' : 'text-gray-400'}`}>
          {value || 'Not specified'}
        </p>
      </div>
      {confirmed && (
        <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
      )}
    </div>
  );

  const budgetItems = tripDetails.budget
    ? [
        { label: 'Flights', value: tripDetails.budget.flights, color: 'bg-blue-500' },
        { label: 'Hotels', value: tripDetails.budget.hotels, color: 'bg-purple-500' },
        { label: 'Activities', value: tripDetails.budget.activities, color: 'bg-green-500' },
        { label: 'Food', value: tripDetails.budget.food, color: 'bg-orange-500' },
      ]
    : [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl mb-6 flex items-center gap-2">
        <Plane className="size-6 text-blue-600" />
        Trip Summary
      </h2>

      <div className="space-y-5">
        <SummaryItem
          icon={MapPin}
          label="Destination"
          value={tripDetails.destination}
          confirmed={!!tripDetails.destination}
        />

        <SummaryItem
          icon={Calendar}
          label="Dates"
          value={
            tripDetails.dates
              ? `${tripDetails.dates.departure} → ${tripDetails.dates.return}`
              : undefined
          }
          confirmed={!!tripDetails.dates}
        />

        <SummaryItem
          icon={Users}
          label="Travelers"
          value={tripDetails.travelers ? `${tripDetails.travelers} ${tripDetails.travelers === 1 ? 'person' : 'people'}` : undefined}
          confirmed={!!tripDetails.travelers}
        />

        <SummaryItem
          icon={Plane}
          label="Origin"
          value={tripDetails.origin}
          confirmed={!!tripDetails.origin}
        />

        {/* Budget with breakdown */}
        <div className={`${tripDetails.budget ? '' : 'opacity-40'}`}>
          <div className="flex items-start gap-3 mb-3">
            <div className="mt-0.5">
              <DollarSign className="size-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Budget</p>
              <p className={`text-xl ${tripDetails.budget ? 'text-gray-900' : 'text-gray-400'}`}>
                {tripDetails.budget ? `$${tripDetails.budget.total.toLocaleString()}` : 'Not specified'}
              </p>
            </div>
            {tripDetails.budget && (
              <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
            )}
          </div>
          {tripDetails.budget && (
            <div className="ml-8 space-y-2">
              {budgetItems.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-gray-900">${item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`${item.color} h-1.5 rounded-full`}
                      style={{ width: `${(item.value / tripDetails.budget!.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interests */}
        <div className={`${tripDetails.interests?.length ? '' : 'opacity-40'}`}>
          <div className="flex items-start gap-3 mb-2">
            <div className="mt-0.5">
              <Tag className="size-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Interests</p>
              {tripDetails.interests?.length ? (
                <div className="flex flex-wrap gap-2">
                  {tripDetails.interests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Not specified</p>
              )}
            </div>
            {tripDetails.interests?.length && (
              <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
            )}
          </div>
        </div>

        {/* Multi-city route visualization */}
        {tripDetails.tripType === 'multi-city' && tripDetails.multiCityRoute && (
          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm text-gray-600 mb-3">Route</p>
            <div className="space-y-2">
              {tripDetails.multiCityRoute.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white size-6 rounded-full flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{stop.city}</p>
                    <p className="text-sm text-gray-600">{stop.dates}</p>
                  </div>
                  {idx < tripDetails.multiCityRoute!.length - 1 && (
                    <ArrowRight className="size-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-booked items */}
        {tripDetails.preBooked && tripDetails.preBooked.length > 0 && (
          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm text-gray-600 mb-3">Pre-booked</p>
            <div className="space-y-2">
              {tripDetails.preBooked.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {item.type === 'flight' ? (
                    <Plane className="size-4 text-blue-600" />
                  ) : (
                    <Hotel className="size-4 text-purple-600" />
                  )}
                  <span className="text-gray-700">{item.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Planning Button */}
      <Button
        onClick={onStartPlanning}
        disabled={!canStartPlanning}
        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed h-12"
      >
        {canStartPlanning ? (
          <>
            <Check className="size-5 mr-2" />
            Start Planning
          </>
        ) : (
          'Collecting trip details...'
        )}
      </Button>
    </div>
  );
}
