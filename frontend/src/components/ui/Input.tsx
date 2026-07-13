import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-mist-900 placeholder:text-mist-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1',
          hasError ? 'border-danger' : 'border-mist-200',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
