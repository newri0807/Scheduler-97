'use client';

import { Win95Window } from './Win95Window';

interface ImageViewerProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export function ImageViewer({ open, onClose, imageUrl, title = 'Image' }: ImageViewerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <Win95Window title={title} onClose={onClose}>
          <div className="bg-black p-2">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto max-h-[70vh] object-contain"
              style={{ imageRendering: 'auto' }}
            />
          </div>
        </Win95Window>
      </div>
    </div>
  );
}
