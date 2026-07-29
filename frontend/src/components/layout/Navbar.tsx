import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, LayoutDashboard, LayoutGrid, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (!user) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-mist-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-violet-gradient font-display text-sm font-bold text-ink-950">
            D
          </span>
          <span className="font-display text-base font-semibold text-mist-900">
            Dr.D Portfolio
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 hover:bg-mist-100 hover:text-mist-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            Tableau de bord
          </Link>
          <Link
            to="/dashboard/projects"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 hover:bg-mist-100 hover:text-mist-900"
          >
            <FolderKanban className="h-4 w-4" />
            Mes projets
          </Link>
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 hover:bg-mist-100 hover:text-mist-900"
          >
            <UserIcon className="h-4 w-4" />
            Mon profil
          </Link>
          <Link
            to="/gallery"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 hover:bg-mist-100 hover:text-mist-900"
          >
            <LayoutGrid className="h-4 w-4" />
            Galerie
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Avatar name={`${user.firstName} ${user.lastName}`} photoUrl={user.profilePhotoUrl} size="sm" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  );
}