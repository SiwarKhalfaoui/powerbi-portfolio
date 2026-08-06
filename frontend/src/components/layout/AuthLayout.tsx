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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mist-50 px-6 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-mesh-light" />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-violet-gradient font-display text-base font-bold text-white">
            D
          </span>
          <span className="font-display text-lg font-semibold text-mist-900">Dr.D Portfolio</span>
        </Link>

        <div className="animate-fade-in-up rounded-3xl border border-mist-200 bg-white p-8 shadow-elevated">
          <p className="text-center font-mono text-xs font-medium uppercase tracking-wider text-teal-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-center font-display text-2xl font-semibold text-mist-900">{title}</h1>
          <p className="mt-2 text-center text-sm text-mist-700">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
