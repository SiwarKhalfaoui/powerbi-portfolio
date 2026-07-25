import { useEffect, useRef, CSSProperties } from 'react';
import { PortfolioMosaic } from './PortfolioMosaic';

/**
 * Signature hero visual: a floating stack of real portfolio-card previews,
 * showing what the platform actually produces, not a fictional dashboard.
 */
export function HeroShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    const handleMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        wrap.style.setProperty('--glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        wrap.style.setProperty('--glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    };

    wrap.addEventListener('mousemove', handleMove);
    return () => {
      wrap.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ '--glow-x': '50%', '--glow-y': '30%' } as CSSProperties}
      className="group relative flex h-[420px] items-center justify-center sm:h-[480px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(34,211,180,0.16), transparent 45%)',
        }}
      />
      <PortfolioMosaic className="relative z-10" />
    </div>
  );
}