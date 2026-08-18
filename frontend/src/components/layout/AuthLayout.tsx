import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { AuthBackground } from '../brand/AuthBackground';

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, eyebrow, title, subtitle }: AuthLayoutProps) {
  return (
    // h-screen (not min-h-screen): the page is locked to the viewport and
    // never grows taller than the screen, so it can never trigger a
    // page-level scrollbar — regardless of how much content a given form
    // (login vs signup) has.
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-mist-50 px-6 py-12">
      <AuthBackground />

      {/*
        This wrapper caps itself to the available viewport height
        (viewport minus the outer py-12 padding). If a form's content
        (e.g. signup, with its extra name fields + helper text) is ever
        taller than that, only the white card below scrolls internally
        — the logo stays put and the page/background never move.
      */}
      <div
        className="relative z-40 flex w-full max-w-sm flex-col"
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
        <Link to="/" className="mb-8 flex shrink-0 items-center justify-center gap-2">
          <Logo size="md" />
          <span className="font-display text-lg font-semibold text-mist-900">Dr.D Portfolio</span>
        </Link>

        <div className="animate-fade-in-up overflow-y-auto rounded-3xl border border-mist-200 bg-white/90 p-8 shadow-elevated backdrop-blur-sm">
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