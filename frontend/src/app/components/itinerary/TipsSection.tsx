import { Bus, Landmark, DollarSign, Shield, Utensils, Luggage } from 'lucide-react';

interface Tip {
  category: 'transport' | 'cultural' | 'money' | 'safety' | 'food' | 'packing';
  text: string;
}

const CATEGORY_CONFIG = {
  transport: { icon: Bus, label: 'Transport', color: 'bg-blue-100 text-blue-600' },
  cultural: { icon: Landmark, label: 'Cultural', color: 'bg-purple-100 text-purple-600' },
  money: { icon: DollarSign, label: 'Money', color: 'bg-green-100 text-green-600' },
  safety: { icon: Shield, label: 'Safety', color: 'bg-red-100 text-red-600' },
  food: { icon: Utensils, label: 'Food', color: 'bg-orange-100 text-orange-600' },
  packing: { icon: Luggage, label: 'Packing', color: 'bg-indigo-100 text-indigo-600' },
};

interface TipsSectionProps {
  tips: Tip[];
}

export function TipsSection({ tips }: TipsSectionProps) {
  return (
    <section id="tips" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl mb-8">Practical Tips</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, idx) => {
            const config = CATEGORY_CONFIG[tip.category];
            const Icon = config.icon;

            return (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`${config.color} p-3 rounded-xl flex-shrink-0`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {config.label}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
