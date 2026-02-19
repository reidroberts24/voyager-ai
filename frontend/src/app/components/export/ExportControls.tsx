import { Download, Mail, Link2, FileText, File, Printer, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { useState } from 'react';

type ExportFormat = 'pdf' | 'markdown' | 'print';

interface ExportControlsProps {
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  includedSections: {
    flights: boolean;
    hotels: boolean;
    weather: boolean;
    budget: boolean;
    tips: boolean;
    rainPlans: boolean;
  };
  onToggleSection: (section: keyof ExportControlsProps['includedSections']) => void;
  onDownload: () => void;
  onEmail: () => void;
  onShareLink: () => void;
}

export function ExportControls({
  selectedFormat,
  onFormatChange,
  includedSections,
  onToggleSection,
  onDownload,
  onEmail,
  onShareLink,
}: ExportControlsProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const formats: { id: ExportFormat; label: string; icon: any }[] = [
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'markdown', label: 'Markdown', icon: File },
    { id: 'print', label: 'Print', icon: Printer },
  ];

  const sections = [
    { id: 'flights' as const, label: 'Flights section' },
    { id: 'hotels' as const, label: 'Hotels section' },
    { id: 'weather' as const, label: 'Weather forecast' },
    { id: 'budget' as const, label: 'Budget breakdown' },
    { id: 'tips' as const, label: 'Practical tips' },
    { id: 'rainPlans' as const, label: 'Rain contingency plans' },
  ];

  const handleShareLink = () => {
    onShareLink();
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Format Selector */}
      <div>
        <Label className="mb-3 block">Export Format</Label>
        <div className="grid grid-cols-3 gap-2">
          {formats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => onFormatChange(format.id)}
                className={`p-3 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
                  selectedFormat === format.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="size-5" />
                <span className="text-sm font-medium">{format.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Include/Exclude Toggles */}
      <div>
        <Label className="mb-3 block">Include Sections</Label>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center justify-between">
              <Label htmlFor={section.id} className="cursor-pointer">
                {section.label}
              </Label>
              <Switch
                id={section.id}
                checked={includedSections[section.id]}
                onCheckedChange={() => onToggleSection(section.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <Button
          onClick={onDownload}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          <Download className="size-5 mr-2" />
          Download {selectedFormat.toUpperCase()}
        </Button>

        <Button
          onClick={onEmail}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Mail className="size-5 mr-2" />
          Send to Email
        </Button>

        <Button
          onClick={handleShareLink}
          variant="outline"
          className="w-full"
          size="lg"
        >
          {linkCopied ? (
            <>
              <Check className="size-5 mr-2" />
              Link Copied!
            </>
          ) : (
            <>
              <Link2 className="size-5 mr-2" />
              Share Link to PDF
            </>
          )}
        </Button>
      </div>

      {/* File Size Estimate */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Estimated file size:</span>
          <span className="font-medium">
            {selectedFormat === 'pdf' ? '2.4 MB' : selectedFormat === 'markdown' ? '45 KB' : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-600">Pages:</span>
          <span className="font-medium">14</span>
        </div>
      </div>
    </div>
  );
}
