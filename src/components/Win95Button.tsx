import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Win95ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
}

export const Win95Button = forwardRef<HTMLButtonElement, Win95ButtonProps>(
  ({ className, children, disabled, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'win95-button px-4 py-1 text-sm font-bold min-h-[32px] touch-manipulation',
          disabled && 'cursor-not-allowed',
          variant === 'primary' && 'font-black',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Win95Button.displayName = 'Win95Button';
