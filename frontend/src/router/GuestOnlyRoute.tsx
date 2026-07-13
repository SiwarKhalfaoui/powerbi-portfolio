import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { FullPageLoader } from '../components/ui/FullPageLoader';

/** Sends an already-logged-in user to /dashboard instead of showing /login or /signup again. */
export function GuestOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <FullPageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
