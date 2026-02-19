import { useState } from 'react';
import { X, Link2, Check, Mail, MessageCircle, FileText, Download, Printer, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  permission: 'view' | 'edit' | 'suggest';
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  shareLink: string;
  collaborators: Collaborator[];
  onAddCollaborator: (email: string, permission: 'view' | 'edit' | 'suggest') => void;
  onRemoveCollaborator: (id: string) => void;
  onChangePermission: (id: string, permission: 'view' | 'edit' | 'suggest') => void;
  onTogglePublicLink: (enabled: boolean) => void;
  publicLinkEnabled: boolean;
}

export function ShareModal({
  isOpen,
  onClose,
  tripTitle,
  shareLink,
  collaborators,
  onAddCollaborator,
  onRemoveCollaborator,
  onChangePermission,
  onTogglePublicLink,
  publicLinkEnabled,
}: ShareModalProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState<'view' | 'edit' | 'suggest'>('view');
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleInvite = () => {
    if (inviteEmail && /\S+@\S+\.\S+/.test(inviteEmail)) {
      onAddCollaborator(inviteEmail, invitePermission);
      setInviteEmail('');
      toast.success(`Invitation sent to ${inviteEmail}`);
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = `Check out my trip: ${tripTitle}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareLink);

    const urls: { [key: string]: string } = {
      email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  const handleExport = (format: 'pdf' | 'markdown') => {
    console.log(`Exporting as ${format}`);
    toast.success(`Preparing ${format.toUpperCase()} export...`);
    // In a real app, this would trigger a download
  };

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog...');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-medium">Share this trip</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Public Link Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Anyone with the link can view</Label>
                <p className="text-sm text-gray-600">Generate a public share link</p>
              </div>
              <Switch
                checked={publicLinkEnabled}
                onCheckedChange={onTogglePublicLink}
              />
            </div>

            {publicLinkEnabled && (
              <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button onClick={handleCopyLink} variant="outline">
                  {linkCopied ? (
                    <>
                      <Check className="size-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Link2 className="size-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Invite Collaborators */}
          <div className="space-y-3">
            <Label>Invite collaborators</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                className="flex-1"
              />
              <Select
                value={invitePermission}
                onValueChange={(value: 'view' | 'edit' | 'suggest') => setInvitePermission(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Can view</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="suggest">Can suggest</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite}>Invite</Button>
            </div>
          </div>

          {/* Current Collaborators */}
          {collaborators.length > 0 && (
            <div className="space-y-3">
              <Label>Collaborators ({collaborators.length})</Label>
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                        {collaborator.avatar ? (
                          <img
                            src={collaborator.avatar}
                            alt={collaborator.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          collaborator.initials
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{collaborator.name}</p>
                        <p className="text-sm text-gray-600">{collaborator.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={collaborator.permission}
                        onValueChange={(value: 'view' | 'edit' | 'suggest') =>
                          onChangePermission(collaborator.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">Can view</SelectItem>
                          <SelectItem value="edit">Can edit</SelectItem>
                          <SelectItem value="suggest">Can suggest</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveCollaborator(collaborator.id)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Share */}
          <div className="space-y-3">
            <Label>Share via</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleSocialShare('email')}
              >
                <Mail className="size-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleSocialShare('whatsapp')}
              >
                <MessageCircle className="size-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleSocialShare('twitter')}
              >
                <svg className="size-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </Button>
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <Label>Export</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
              >
                <Download className="size-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('markdown')}
              >
                <FileText className="size-4 mr-2" />
                Markdown
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="size-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
