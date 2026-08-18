import { useEffect, useState } from 'react';
import {
  BarChart3,
  Eye,
  FolderKanban,
  Globe2,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react';
import { GradientMeshCanvas } from './GradientMeshCanvas';



function WindowChrome({
  filename,
  status,
}: {
  filename: string;
  status?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-mist-100/80 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-danger/65" />
      <span className="h-2 w-2 rounded-full bg-amber/70" />
      <span className="h-2 w-2 rounded-full bg-teal/75" />

      <span className="ml-1.5 truncate font-mono text-[9px] text-mist-400">
        {filename}
      </span>

      {status && (
        <span className="ml-auto shrink-0 rounded-full bg-teal/10 px-1.5 py-0.5 font-mono text-[8px] font-medium text-teal-700">
          {status}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO — POWER BI REPORT PREVIEW                                             */
/* -------------------------------------------------------------------------- */

function HeroReportPanel() {
  return (
    <div className="w-56 rounded-2xl border border-white/80 bg-white/90 shadow-float-card ring-1 ring-teal/15 backdrop-blur-md sm:w-64">
      <WindowChrome filename="sales-performance.pbix" status="LIVE" />

      <div className="p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10">
            <BarChart3 className="h-4 w-4 text-teal-700" />
          </div>

          <div>
            <p className="font-display text-[11px] font-semibold text-mist-900">
              Sales Performance
            </p>
            <p className="text-[9px] text-mist-400">Power BI Report</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-mist-100 bg-mist-50/70 p-2.5">
          <div className="flex items-end gap-1.5">
            {[28, 42, 32, 49, 37, 55, 46].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-[3px]"
                style={{
                  height: `${height}px`,
                  background: index >= 4 ? '#8B7CF6' : '#22D3B4',
                  opacity: 0.82,
                }}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[8px] text-mist-400">Interactive report</span>
            <span className="flex items-center gap-1 text-[8px] font-medium text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Published
            </span>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-teal/5 px-2 py-1.5">
            <p className="text-[7px] uppercase tracking-wide text-mist-400">KPIs</p>
            <p className="mt-0.5 font-display text-[11px] font-semibold text-mist-900">12</p>
          </div>

          <div className="rounded-lg bg-violet/5 px-2 py-1.5">
            <p className="text-[7px] uppercase tracking-wide text-mist-400">Pages</p>
            <p className="mt-0.5 font-display text-[11px] font-semibold text-mist-900">06</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO — PUBLIC PORTFOLIO / SHAREABLE LINK                                   */
/* -------------------------------------------------------------------------- */

function HeroPortfolioPanel() {
  return (
    <div className="w-56 rounded-2xl border border-white/80 bg-white/90 shadow-float-card ring-1 ring-violet/15 backdrop-blur-md sm:w-60">
      <WindowChrome filename="public-portfolio" status="ONLINE" />

      <div className="p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10">
            <Globe2 className="h-4 w-4 text-teal-700" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-display text-[11px] font-semibold text-mist-900">
              Public Portfolio
            </p>
            <p className="truncate font-mono text-[8px] text-teal-700">drd.io/sarah.k</p>
          </div>

          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-teal-500 shadow-[0_0_0_3px_rgba(34,211,180,0.12)]" />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-mist-50 px-2 py-2 text-center">
            <FolderKanban className="mx-auto h-3 w-3 text-violet-500" />
            <p className="mt-1 font-display text-sm font-semibold text-mist-900">08</p>
            <p className="text-[7px] uppercase tracking-wide text-mist-400">Projets</p>
          </div>

          <div className="rounded-xl bg-mist-50 px-2 py-2 text-center">
            <Eye className="mx-auto h-3 w-3 text-teal-600" />
            <p className="mt-1 font-display text-sm font-semibold text-mist-900">1.2K</p>
            <p className="text-[7px] uppercase tracking-wide text-mist-400">Vues</p>
          </div>

          <div className="rounded-xl bg-mist-50 px-2 py-2 text-center">
            <Share2 className="mx-auto h-3 w-3 text-amber-500" />
            <p className="mt-1 font-display text-sm font-semibold text-mist-900">24</p>
            <p className="text-[7px] uppercase tracking-wide text-mist-400">Partages</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-teal/5 px-2.5 py-2">
          <span className="text-[8px] text-mist-500">Visibilité</span>
          <span className="flex items-center gap-1.5 text-[8px] font-semibold text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Public
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* LIGHTWEIGHT STAT PILL                                                      */
/* -------------------------------------------------------------------------- */

type PillTint = 'teal' | 'violet' | 'amber';

const PILL_TINTS: Record<PillTint, { bg: string; text: string }> = {
  teal: { bg: 'bg-teal/10', text: 'text-teal-700' },
  violet: { bg: 'bg-violet/10', text: 'text-violet-600' },
  amber: { bg: 'bg-amber/10', text: 'text-amber-600' },
};

function StatPill({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: typeof Eye;
  value: string;
  label: string;
  tint: PillTint;
}) {
  const { bg, text } = PILL_TINTS[tint];

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 py-1.5 pl-1.5 pr-3.5 shadow-float-card ring-1 ring-mist-100/70 backdrop-blur-md">
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-3 w-3 ${text}`} />
      </span>

      <span className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="font-display text-[11px] font-semibold text-mist-900">{value}</span>
        <span className="text-[8px] text-mist-400">{label}</span>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMMUNITY RING — subtle nod to the platform's social/discovery features    */
/* -------------------------------------------------------------------------- */

const RING_NODES: Array<{ x: number; y: number }> = [
  { x: 96, y: 50 },
  { x: 87.2, y: 74.7 },
  { x: 64.2, y: 89.9 },
  { x: 35.8, y: 89.9 },
  { x: 12.8, y: 74.7 },
  { x: 4, y: 50 },
  { x: 12.8, y: 25.3 },
  { x: 35.8, y: 10.1 },
  { x: 64.2, y: 10.1 },
  { x: 87.2, y: 25.3 },
];

const RING_PATH_D = 'M 96 50 A 46 40 0 1 1 4 50 A 46 40 0 1 1 96 50';

function CommunityRing({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="ringNodeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        id="community-ring"
        d={RING_PATH_D}
        fill="none"
        stroke="#8B7CF6"
        strokeOpacity="0.16"
        strokeWidth="0.12"
        strokeDasharray="0.6 1.4"
        vectorEffect="non-scaling-stroke"
      />

      {RING_NODES.map((node, index) => (
        <circle
          key={index}
          cx={node.x}
          cy={node.y}
          r="0.55"
          fill={index % 2 === 0 ? '#22D3B4' : '#8B7CF6'}
          fillOpacity="0.35"
          filter="url(#ringNodeGlow)"
          style={
            reducedMotion
              ? undefined
              : {
                  animation: `ringNodePulse ${4.5 + (index % 4)}s ease-in-out infinite`,
                  animationDelay: `${index * 0.4}s`,
                  transformOrigin: `${node.x}px ${node.y}px`,
                }
          }
        />
      ))}

      {!reducedMotion &&
        [0, 1, 2].map((i) => (
          <circle key={`particle-${i}`} r="0.45" fill="#22D3B4" filter="url(#ringNodeGlow)">
            <animateMotion
              dur={`${34 + i * 8}s`}
              begin={`${i * 6}s`}
              repeatCount="indefinite"
            >
              <mpath href="#community-ring" />
            </animateMotion>
          </circle>
        ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* SELF-CONTAINED FLOAT ANIMATIONS                                            */
/* -------------------------------------------------------------------------- */

/**
 * Hero cards drift a bit more (±10–12px) than the small pills (±5–6px),
 * which reads as depth — like the bigger elements are slightly closer
 * to the viewer. Everything uses a slow cubic-bezier ease so the motion
 * feels like a gentle breathing rhythm rather than a mechanical bounce,
 * and no two elements share the same duration/delay so nothing moves
 * in sync.
 */
const FLOAT_STYLE_TAG = `
  @keyframes heroFloatA {
    0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
    50%  { transform: translate3d(-7px, 10px, 0) rotate(-0.4deg); }
    100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  }
  @keyframes heroFloatB {
    0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
    50%  { transform: translate3d(8px, -9px, 0) rotate(0.4deg); }
    100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  }
  @keyframes pillFloatA {
    0%   { transform: translate3d(0, 0, 0); }
    50%  { transform: translate3d(0, -6px, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
  @keyframes pillFloatB {
    0%   { transform: translate3d(0, 0, 0); }
    50%  { transform: translate3d(0, 6px, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
  @keyframes pillFloatC {
    0%   { transform: translate3d(0, 0, 0); }
    50%  { transform: translate3d(-5px, 0, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
  @keyframes pillFloatD {
    0%   { transform: translate3d(0, 0, 0); }
    50%  { transform: translate3d(5px, 0, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
  @keyframes ringNodePulse {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50%      { opacity: 0.75; transform: scale(1.6); }
  }
`;

const FLOAT_EASE = 'cubic-bezier(0.45, 0, 0.55, 1)';

export function AuthBackground() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [parallaxEnabled, setParallaxEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReducedMotion || !isFinePointer) return;

    setParallaxEnabled(true);

    let frame: number | null = null;

    function handleMouseMove(e: MouseEvent) {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;

        setParallax({
          x: (e.clientX / innerWidth - 0.5) * 2,
          y: (e.clientY / innerHeight - 0.5) * 2,
        });

        frame = null;
      });
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const floatStyle = (name: string, durationSeconds: number, delaySeconds: number) =>
    reducedMotion
      ? {}
      : {
          animation: `${name} ${durationSeconds}s ${FLOAT_EASE} infinite`,
          animationDelay: `${delaySeconds}s`,
        };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <style>{FLOAT_STYLE_TAG}</style>

      {/* ------------------------------------------------------------------ */}
      {/* TECHNICAL GRID                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(34,48,74,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,48,74,0.045) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* AMBIENT LIGHT — WebGL gradient mesh (see GradientMeshCanvas)       */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={
          parallaxEnabled
            ? { transform: `translate3d(${parallax.x * 6}px, ${parallax.y * 6}px, 0)` }
            : undefined
        }
      >
        <GradientMeshCanvas />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* COMMUNITY RING                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={
          parallaxEnabled
            ? { transform: `translate3d(${parallax.x * 8}px, ${parallax.y * 8}px, 0)` }
            : undefined
        }
      >
        <CommunityRing reducedMotion={reducedMotion} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HERO VISUALS + STAT PILLS                                          */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={
          parallaxEnabled
            ? { transform: `translate3d(${parallax.x * 16}px, ${parallax.y * 16}px, 0)` }
            : undefined
        }
      >
        {/* Hero: Power BI report — top-right, anchored from top+right so it
            can only ever need margin on those two edges. */}
        <div
          className="absolute right-[5%] top-[8%]"
          style={floatStyle('heroFloatA', 24, 0)}
        >
          <HeroReportPanel />
        </div>

        {/* Hero: public portfolio link — bottom-left, mirrored anchoring. */}
        <div
          className="absolute bottom-[8%] left-[5%]"
          style={floatStyle('heroFloatB', 26, 3)}
        >
          <HeroPortfolioPanel />
        </div>

        {/* Pill: monthly views — top-left */}
        <div className="absolute left-[4%] top-[10%]" style={floatStyle('pillFloatA', 17, 1)}>
          <StatPill icon={Eye} value="1.2K" label="vues ce mois" tint="teal" />
        </div>

        {/* Pill: shares — bottom-right */}
        <div className="absolute bottom-[11%] right-[6%]" style={floatStyle('pillFloatB', 19, 2)}>
          <StatPill icon={Share2} value="24" label="partages" tint="amber" />
        </div>

        {/* Pill: community — mid-right edge, vertically centered */}
        <div
          className="absolute right-[3%] top-1/2 -translate-y-1/2"
          style={floatStyle('pillFloatC', 20, 4)}
        >
          <StatPill icon={Users} value="180+" label="data pros" tint="violet" />
        </div>

        {/* Pill: expertise — mid-left edge, vertically centered */}
        <div
          className="absolute left-[3%] top-1/2 -translate-y-1/2"
          style={floatStyle('pillFloatD', 18, 5)}
        >
          <StatPill icon={Sparkles} value="Expert" label="Power BI" tint="teal" />
        </div>
      </div>
    </div>
  );
}