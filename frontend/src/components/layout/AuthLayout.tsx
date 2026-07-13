import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChartMosaic } from '../brand/ChartMosaic';

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, eyebrow, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(34,211,180,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(139,124,246,0.15), transparent 40%)',
          }}
        />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-violet-gradient font-display text-base font-bold text-ink-950">
            D
          </span>
          <span className="font-display text-lg font-semibold text-white">Dr.D Portfolio</span>
        </Link>

        <div className="relative z-10 py-10">
          <ChartMosaic />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-display text-2xl font-semibold leading-snug text-white text-balance">
            Vos dashboards Power BI méritent mieux qu'une capture d'écran.
          </p>
          <p className="mt-3 text-sm text-mist-400">
            Rejoignez la communauté Power BI, Data &amp; AI et publiez un portfolio que les
            recruteurs peuvent réellement explorer.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-violet-gradient font-display text-sm font-bold text-ink-950">
              D
            </span>
            <span className="font-display text-base font-semibold text-mist-900">
              Dr.D Portfolio
            </span>
          </Link>

          <p className="font-mono text-xs font-medium uppercase tracking-wider text-teal-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-mist-900">{title}</h1>
          <p className="mt-2 text-sm text-mist-700">{subtitle}</p>

          <div className="mt-8 animate-fade-in-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
