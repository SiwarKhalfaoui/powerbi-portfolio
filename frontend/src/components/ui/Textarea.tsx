import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-mist-900 placeholder:text-mist-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1',
          hasError ? 'border-danger' : 'border-mist-200',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
