import { useEffect, useRef, CSSProperties } from 'react';
import { ChartMosaic } from './ChartMosaic';

/**
 * Staged presentation of the ChartMosaic brand visual for the marketing Hero.
 * Framed as a browser window with the platform's personalized-URL pattern in
 * the address bar — the product's core differentiator (a real, shareable
 * page, not a screenshot) made visible rather than described — with an
 * ambient, cursor-reactive glow on pointer-capable devices.
 */
export function HeroShowcase() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    const handleMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        panel.style.setProperty('--glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    };

    panel.addEventListener('mousemove', handleMove);
    return () => {
      panel.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      style={{ '--glow-x': '25%', '--glow-y': '15%' } as CSSProperties}
      className="group relative overflow-hidden rounded-3xl border border-ink-700/60 bg-ink-950 shadow-elevated"
    >
      {/* Static brand-color mesh — always visible, gives the panel depth at rest */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 10%, rgba(34,211,180,0.16), transparent 45%), radial-gradient(circle at 85% 80%, rgba(139,124,246,0.16), transparent 45%)',
        }}
      />

     
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(34,211,180,0.18), transparent 40%)',
        }}
      />

      {/* Browser chrome — frames the mosaic as a real, visitable page rather than a screenshot */}
      <div className="relative z-10 flex items-center gap-3 border-b border-white/5 px-5 py-3.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-mist-700" />
          <span className="h-2 w-2 rounded-full bg-mist-700" />
          <span className="h-2 w-2 rounded-full bg-mist-700" />
        </div>
        <div className="flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-center font-mono text-xs text-mist-400">
          drd.io/votre-nom
        </div>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <ChartMosaic />
      </div>
    </div>
  );
}