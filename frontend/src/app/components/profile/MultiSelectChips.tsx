import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

interface MultiSelectChipsProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelectChips({ options, selected, onChange, placeholder }: MultiSelectChipsProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <Badge
              key={item}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pl-3 pr-2 py-1.5 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              onClick={() => toggleOption(item)}
            >
              {item}
              <X className="size-3 ml-1.5" />
            </Badge>
          ))}
        </div>
      )}

      {/* Available options */}
      <div className="flex flex-wrap gap-2">
        {options
          .filter(opt => !selected.includes(opt))
          .map((option) => (
            <Badge
              key={option}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100 px-3 py-1.5"
              onClick={() => toggleOption(option)}
            >
              + {option}
            </Badge>
          ))}
      </div>

      {selected.length === 0 && placeholder && (
        <p className="text-sm text-gray-500 italic">{placeholder}</p>
      )}
    </div>
  );
}
