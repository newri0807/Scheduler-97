import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Win95InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Win95Input = forwardRef<HTMLInputElement, Win95InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'win95-inset px-2 py-1 text-sm w-full min-h-[28px] focus:outline-none',
          className
        )}
        {...props}
      />
    );
  }
);

Win95Input.displayName = 'Win95Input';
