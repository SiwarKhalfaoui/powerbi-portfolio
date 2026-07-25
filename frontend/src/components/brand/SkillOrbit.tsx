import { cn } from '../../lib/utils';

const DEFAULT_TAGS = ['Power BI', 'DAX', 'SQL', 'Tableau', 'Python', 'Looker'];

interface SkillOrbitProps {
  tags?: string[];
  radius?: number;
  size?: number;
  className?: string;
}

/**
 * An orbiting ring of the tools this community actually works in — the
 * hero's signature element, standing in for the generic KPI mosaic.
 * Each tag counter-rotates against the ring's own spin so the text stays
 * upright throughout the animation. Respects prefers-reduced-motion via
 * the global override in index.css.
 */
export function SkillOrbit({ tags = DEFAULT_TAGS, radius = 270, size = 600, className }: SkillOrbitProps) {
  const step = 360 / tags.length;

  return (
    <div
      className={cn('pointer-events-none absolute left-1/2 top-1/2 animate-spin-slow', className)}
      style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      aria-hidden="true"
    >
      {tags.map((tag, i) => {
        const angle = step * i;
        return (
          <div
            key={tag}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translateX(${radius}px)` }}
          >
            <div className="animate-spin-slow-reverse">
              <span
                className="block whitespace-nowrap rounded-full border border-white/10 bg-ink-950/70 px-3 py-1.5 font-mono text-[11px] text-mist-400 backdrop-blur-sm"
                style={{ transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}
              >
                {tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}