import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthInitializer } from './features/auth/AuthInitializer';
import { ProtectedRoute } from './router/ProtectedRoute';
import { GuestOnlyRoute } from './router/GuestOnlyRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { ProjectCreatePage } from './pages/ProjectCreatePage';
import { ProjectEditPage } from './pages/ProjectEditPage';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route element={<GuestOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfileEditPage />} />
              <Route path="/dashboard/projects" element={<ProjectsListPage />} />
              <Route path="/dashboard/projects/new" element={<ProjectCreatePage />} />
              <Route path="/dashboard/projects/:id/edit" element={<ProjectEditPage />} />
            </Route>

            <Route path="/:slug" element={<PublicPortfolioPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}