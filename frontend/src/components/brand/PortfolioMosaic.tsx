import { useEffect, useRef, CSSProperties } from 'react';
import { cn } from '../../lib/utils';
import { LiveUrlBadge } from './LiveUrlBadge';

const PROJECTS = [
  {
    tag: 'SQL · Churn',
    title: 'Prédiction de churn client',
    author: 'Marc D.',
    accent: 'violet' as const,
  },
  {
    tag: 'Power BI · Retail',
    title: 'Dashboard ventes retail',
    author: 'Sarah K.',
    role: 'Data Analyst',
    accent: 'teal' as const,
  },
];

interface PortfolioMosaicProps {
  className?: string;
}

/**
 * The signature visual for the brand: two floating portfolio-project cards
 * plus a live-typing URL badge. The front card tilts toward the cursor
 * (subtle 3D depth) so it reads as a physical object with presence, and the
 * badge visualizes the product's actual differentiator — a real, personal,
 * shareable link — rather than decorating with unrelated motion.
 */
export function PortfolioMosaic({ className }: PortfolioMosaicProps) {
  const [back, front] = PROJECTS;
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = frontRef.current;
    if (!card) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    const handleMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', `${px * 10}deg`);
        card.style.setProperty('--tilt-y', `${py * -10}deg`);
      });
    };
    const resetTilt = () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', resetTilt);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', resetTilt);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cn('relative h-72 w-72 sm:h-80 sm:w-80', className)}>
      <div
        aria-hidden="true"
        className="absolute -top-2 right-0 w-52 rotate-6 rounded-2xl border border-mist-200 bg-white/80 p-4 opacity-90 shadow-card backdrop-blur-xl sm:w-56"
      >
        <span className="inline-block rounded-full border border-violet/30 bg-violet/10 px-2.5 py-1 font-mono text-[10px] text-violet-600">
          {back.tag}
        </span>
        <p className="mt-3 font-display text-sm font-semibold text-mist-900">{back.title}</p>
        <p className="mt-1 text-xs text-mist-400">par {back.author}</p>
      </div>

      <div aria-hidden="true" className="absolute bottom-0 left-0 w-64 animate-float-slow sm:w-72">
        <div className="rounded-2xl shadow-elevated">
          <div
            ref={frontRef}
            style={
              {
                '--tilt-x': '0deg',
                '--tilt-y': '0deg',
                transform: 'perspective(900px) rotateX(var(--tilt-y)) rotateY(var(--tilt-x)) rotate(-3deg)',
                transition: 'transform 0.2s ease-out',
              } as CSSProperties
            }
            className="rounded-2xl border border-mist-200 bg-white/90 p-5 backdrop-blur-xl"
          >
            <span className="inline-block rounded-full border border-teal/30 bg-teal/10 px-2.5 py-1 font-mono text-[10px] text-teal-700">
              {front.tag}
            </span>
            <p className="mt-3 font-display text-base font-semibold text-mist-900">{front.title}</p>
            <p className="mt-1 text-xs text-mist-400">
              par <span className="text-mist-700">{front.author}</span> — {front.role}
            </p>
            <svg viewBox="0 0 220 64" className="mt-4 h-14 w-full" aria-hidden="true">
              <rect x="0" y="28" width="20" height="36" rx="4" fill="#22D3B4" />
              <rect x="28" y="12" width="20" height="52" rx="4" fill="#8B7CF6" />
              <rect x="56" y="36" width="20" height="28" rx="4" fill="#22D3B4" />
              <rect x="84" y="4" width="20" height="60" rx="4" fill="#F5A623" />
              <rect x="112" y="20" width="20" height="44" rx="4" fill="#22D3B4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 right-2 sm:right-6">
        <LiveUrlBadge />
      </div>
    </div>
  );
}