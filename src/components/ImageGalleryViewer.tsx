'use client';

import { useState } from 'react';
import { Win95Window } from './Win95Window';
import { Win95Button } from './Win95Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryViewerProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export function ImageGalleryViewer({
  open,
  onClose,
  images,
  initialIndex = 0,
  title = 'Image Gallery',
}: ImageGalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!open || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh]">
        <Win95Window title={`${title} (${currentIndex + 1}/${images.length})`} onClose={onClose}>
          <div className="space-y-2">
            {/* Main Image */}
            <div className="bg-black p-2">
              <img
                src={images[currentIndex]}
                alt={`${title} ${currentIndex + 1}`}
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                style={{ imageRendering: 'auto' }}
              />
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Win95Button onClick={handlePrev} className="px-2">
                  <ChevronLeft className="w-4 h-4" />
                </Win95Button>
                <span className="text-sm font-bold">
                  {currentIndex + 1} / {images.length}
                </span>
                <Win95Button onClick={handleNext} className="px-2">
                  <ChevronRight className="w-4 h-4" />
                </Win95Button>
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="win95-inset p-1 max-h-20 overflow-x-auto">
                <div className="flex gap-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`win95-button p-0 flex-shrink-0 ${
                        idx === currentIndex ? 'border-2 border-blue-800' : ''
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-16 h-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Win95Window>
      </div>
    </div>
  );
}
