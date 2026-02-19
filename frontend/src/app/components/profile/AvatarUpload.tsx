import { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { Button } from '../ui/button';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => void;
}

export function AvatarUpload({ currentAvatar, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentAvatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="size-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="size-12 text-white" />
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <Camera className="size-4 text-gray-700" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <p className="font-medium mb-1">Profile Photo</p>
        <p className="text-sm text-gray-600">JPG, PNG or GIF. Max size 5MB.</p>
      </div>
    </div>
  );
}
