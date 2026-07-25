import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, eyebrow, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(600px 500px at 15% 20%, rgba(34,211,180,0.18), transparent 60%), radial-gradient(700px 600px at 85% 15%, rgba(139,124,246,0.20), transparent 60%), radial-gradient(500px 500px at 75% 90%, rgba(245,166,35,0.10), transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 90%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-violet-gradient font-display text-base font-bold text-ink-950">
            D
          </span>
          <span className="font-display text-lg font-semibold text-white">Dr.D Portfolio</span>
        </Link>

        <div className="animate-fade-in-up rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated backdrop-blur-2xl">
          <p className="text-center font-mono text-xs font-medium uppercase tracking-wider text-teal">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-center font-display text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-center text-sm text-mist-400">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
