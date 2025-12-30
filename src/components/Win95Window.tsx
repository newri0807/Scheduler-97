import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Win95WindowProps {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  width?: string;
}

export function Win95Window({
  title,
  onClose,
  children,
  className,
  width = 'w-full',
}: Win95WindowProps) {
  return (
    <div className={cn('win95-panel', width, className)}>
      {/* Title Bar */}
      <div className="win95-title-bar">
        <span className="text-white text-sm font-bold px-1">{title}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="win95-close-button text-black hover:bg-gray-400"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
      {/* Content */}
      <div className="p-2">{children}</div>
    </div>
  );
}
