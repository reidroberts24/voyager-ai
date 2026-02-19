import { DollarSign, MessageCircle, Clock, Phone, Sun, Cloud, CloudRain } from 'lucide-react';

interface WeatherDay {
  date: string;
  icon: 'sun' | 'cloud' | 'rain';
  high: number;
  low: number;
}

interface OverviewSectionProps {
  description: string;
  inlineImages?: string[];
  currency?: string;
  language?: string;
  timezone?: string;
  visa?: string;
  emergency?: string;
  weather?: WeatherDay[];
  hasWeatherData?: boolean;
}

export function OverviewSection({
  description,
  inlineImages = [],
  currency = '€ EUR',
  language = 'Italian',
  timezone = 'CET (UTC+1)',
  visa = 'Not required for US citizens (up to 90 days)',
  emergency = '112',
  weather,
  hasWeatherData = false,
}: OverviewSectionProps) {
  const getWeatherIcon = (icon: 'sun' | 'cloud' | 'rain') => {
    switch (icon) {
      case 'sun':
        return <Sun className="size-8 text-yellow-500" />;
      case 'cloud':
        return <Cloud className="size-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="size-8 text-blue-500" />;
    }
  };

  return (
    <section id="overview" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl mb-8">Overview</h2>

        {/* Destination Description with Inline Images */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4 text-gray-700 leading-relaxed">
            {description.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <div className="space-y-4">
            {inlineImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Rome scene ${idx + 1}`}
                className="w-full h-48 object-cover rounded-xl shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="size-5 text-blue-600" />
              <p className="text-sm text-gray-600">Currency</p>
            </div>
            <p className="font-medium">{currency}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="size-5 text-blue-600" />
              <p className="text-sm text-gray-600">Language</p>
            </div>
            <p className="font-medium">{language}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-5 text-blue-600" />
              <p className="text-sm text-gray-600">Timezone</p>
            </div>
            <p className="font-medium">{timezone}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🛂</span>
              <p className="text-sm text-gray-600">Visa</p>
            </div>
            <p className="font-medium text-sm">{visa}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="size-5 text-red-600" />
              <p className="text-sm text-gray-600">Emergency</p>
            </div>
            <p className="font-medium">{emergency}</p>
          </div>
        </div>

        {/* Weather Forecast */}
        {hasWeatherData && weather ? (
          <div>
            <h3 className="text-xl mb-4">Weather Forecast</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {weather.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 min-w-[140px] text-center border border-blue-100"
                >
                  <p className="text-sm text-gray-600 mb-2">{day.date}</p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.icon)}
                  </div>
                  <div className="flex justify-center gap-2 text-lg">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-gray-500">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800">
              ☁️ Weather forecast will be available closer to your trip date
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
