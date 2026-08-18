import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban } from 'lucide-react';
import { cn } from '../../lib/utils';

const tabs = [
  { to: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users, end: false },
  { to: '/admin/projects', label: 'Projets', icon: FolderKanban, end: false },
];

export function AdminTabs() {
  return (
    <div className="mb-8 inline-flex items-center gap-1 rounded-full bg-mist-100 p-1">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-teal-violet-gradient text-white shadow-glow'
                : 'text-mist-700 hover:bg-white/70 hover:text-ink-900',
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}