import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  timestamp?: string;
}

export function ChatMessage({ type, content, suggestions, onSuggestionClick, timestamp }: ChatMessageProps) {
  if (type === 'user') {
    return (
      <div className="flex justify-end mb-4 animate-in slide-in-from-right duration-300">
        <div className="max-w-[80%] md:max-w-[70%]">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-sm px-5 py-3">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
          {timestamp && (
            <p className="text-xs text-gray-400 mt-1 text-right">{timestamp}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4 animate-in slide-in-from-left duration-300">
      <div className="flex-shrink-0">
        <div className="size-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <Sparkles className="size-5 text-white" />
        </div>
      </div>
      <div className="flex-1 max-w-[80%] md:max-w-[70%]">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
          <p className="whitespace-pre-wrap text-gray-800">{content}</p>
        </div>
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {timestamp && (
          <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
}
