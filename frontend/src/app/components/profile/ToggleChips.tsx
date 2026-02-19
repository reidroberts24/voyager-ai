import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';

interface ToggleChipsProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function ToggleChips({ options, selected, onChange }: ToggleChipsProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Badge
            key={option}
            className={`cursor-pointer px-3 py-2 transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleOption(option)}
          >
            {isSelected && <Check className="size-3 mr-1.5" />}
            {option}
          </Badge>
        );
      })}
    </div>
  );
}
