interface LogoProps {
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
};

export function Logo({ size = 'sm' }: LogoProps) {
  return (
    <img
      src="/logo-drd.jpeg"
      alt="Dr.D Portfolio"
      className={`${sizeClasses[size]} rounded-lg object-contain`}
    />
  );
}