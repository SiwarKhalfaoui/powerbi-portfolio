import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { FullPageLoader } from '../components/ui/FullPageLoader';
import { DashboardLayout } from '../components/layout/DashboardLayout';

/** Redirects to /login unless a session is active; wraps children in the dashboard chrome. */
export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
