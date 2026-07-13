import { useEffect, useRef } from 'react';
import { useAuthStore } from './authStore';
import { refreshRequest } from './authApi';

/**
 * Mounted once at the app root. The access token lives only in memory, so
 * a hard page reload loses it — this silently exchanges the httpOnly
 * refresh cookie (if any) for a fresh access token before rendering
 * protected routes, so a logged-in user isn't bounced to /login on refresh.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitializing = useAuthStore((s) => s.setInitializing);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    refreshRequest()
      .then((result) => setAuth(result.user, result.accessToken))
      .catch(() => {
        // No valid session cookie — that's a normal logged-out state.
      })
      .finally(() => setInitializing(false));
  }, [setAuth, setInitializing]);

  return <>{children}</>;
}
