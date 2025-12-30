'use client';

import { useRef } from 'react';
import { Win95Button } from './Win95Button';
import { Image as ImageIcon } from 'lucide-react';

interface Win95FileInputProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export function Win95FileInput({
  onFileSelect,
  accept = 'image/*',
  disabled = false,
  multiple = false,
}: Win95FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelect(files);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <Win95Button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="flex items-center gap-1 text-xs"
      >
        <ImageIcon className="w-3 h-3" />
        Browse...
      </Win95Button>
    </>
  );
}
