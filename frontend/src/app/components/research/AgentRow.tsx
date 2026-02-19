import { Check, Loader2, LucideIcon } from 'lucide-react';

export type AgentStatus = 'pending' | 'running' | 'complete';

interface AgentRowProps {
  icon: LucideIcon;
  label: string;
  status: AgentStatus;
  result?: string;
}

export function AgentRow({ icon: Icon, label, status, result }: AgentRowProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 animate-in fade-in duration-300">
      <div
        className={`flex-shrink-0 size-12 rounded-full flex items-center justify-center transition-all ${
          status === 'complete'
            ? 'bg-green-100'
            : status === 'running'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
            : 'bg-gray-200'
        }`}
      >
        <Icon
          className={`size-6 ${
            status === 'complete'
              ? 'text-green-600'
              : status === 'running'
              ? 'text-white'
              : 'text-gray-400'
          }`}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p
            className={`font-medium ${
              status === 'complete'
                ? 'text-gray-900'
                : status === 'running'
                ? 'text-gray-900'
                : 'text-gray-500'
            }`}
          >
            {label}
          </p>
          {status === 'running' && (
            <Loader2 className="size-4 text-blue-600 animate-spin" />
          )}
          {status === 'complete' && (
            <Check className="size-5 text-green-600" />
          )}
        </div>
        
        {result && status === 'complete' && (
          <p className="text-sm text-gray-600 animate-in fade-in slide-in-from-top-1 duration-300">
            {result}
          </p>
        )}
      </div>
    </div>
  );
}
