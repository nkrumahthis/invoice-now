import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, X } from 'lucide-react';

interface LogoUploadProps {
  value?: string;
  onChange: (logo: string) => void;
  className?: string;
}

function LogoUpload({ value, onChange, className = '' }: LogoUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Company Logo</Label>
      
      {value ? (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Company logo"
            className="w-full h-full object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('logo-input')?.click()}
        >
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Drag and drop your logo here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      )}
      
      <Input
        id="logo-input"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
    </div>
  );
}

export default LogoUpload;