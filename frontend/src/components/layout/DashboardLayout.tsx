import { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-mist-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}