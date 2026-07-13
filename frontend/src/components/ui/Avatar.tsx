import { cn } from '../../lib/utils';

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-14 w-14 text-lg',
  lg: 'h-24 w-24 text-3xl',
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Avatar({ name, photoUrl, size = 'md', className }: AvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={cn('rounded-full object-cover', SIZE_CLASSES[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-teal-violet-gradient font-display font-semibold text-white',
        SIZE_CLASSES[size],
        className,
      )}
      aria-hidden="true"
    >
      {getInitials(name) || '?'}
    </div>
  );
}
