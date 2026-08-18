import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { FullPageLoader } from '../components/ui/FullPageLoader';
import { DashboardLayout } from '../components/layout/DashboardLayout';

/** Same as ProtectedRoute, plus a role check. Non-admins are bounced to /dashboard, not /login. */
export function AdminRoute() {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}