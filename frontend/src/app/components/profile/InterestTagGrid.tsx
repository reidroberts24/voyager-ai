import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';

interface InterestTagGridProps {
  interests: Array<{ name: string; icon?: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function InterestTagGrid({ interests, selected, onChange }: InterestTagGridProps) {
  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      onChange(selected.filter(item => item !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {interests.map((interest) => {
        const isSelected = selected.includes(interest.name);
        return (
          <button
            key={interest.name}
            onClick={() => toggleInterest(interest.name)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              isSelected
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                <Check className="size-3 text-white" />
              </div>
            )}
            {interest.icon && <span className="text-2xl mb-2 block">{interest.icon}</span>}
            <p className="text-sm font-medium text-gray-900">{interest.name}</p>
          </button>
        );
      })}
    </div>
  );
}
