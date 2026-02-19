import { Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface CollaboratorBannerProps {
  ownerName: string;
  ownerAvatar?: string;
  ownerInitials: string;
  permission: 'view' | 'edit' | 'suggest';
  onSaveCopy?: () => void;
}

export function CollaboratorBanner({
  ownerName,
  ownerAvatar,
  ownerInitials,
  permission,
  onSaveCopy,
}: CollaboratorBannerProps) {
  const permissionConfig = {
    view: { label: 'View only', color: 'bg-gray-600' },
    edit: { label: 'Can edit', color: 'bg-green-600' },
    suggest: { label: 'Can suggest', color: 'bg-blue-600' },
  };

  const handleSaveCopy = () => {
    onSaveCopy?.();
    toast.success('Copy saved to your trips!');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              {ownerAvatar ? (
                <img
                  src={ownerAvatar}
                  alt={ownerName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-medium">{ownerInitials}</span>
              )}
            </div>
            <div>
              <p className="text-white/90 text-sm">Shared by</p>
              <p className="font-medium text-lg">{ownerName}</p>
            </div>
            <Badge className={`${permissionConfig[permission].color} text-white border-0 ml-2`}>
              {permissionConfig[permission].label}
            </Badge>
          </div>

          {permission === 'view' && (
            <Button
              onClick={handleSaveCopy}
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              <Copy className="size-4 mr-2" />
              Save a copy to My Trips
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
