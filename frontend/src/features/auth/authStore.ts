import { create } from 'zustand';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  /** True while the app is trying to silently restore a session on load. */
  isInitializing: boolean;
  setAuth: (user: User, accessToken: string) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  setInitializing: (value: boolean) => void;
}

/**
 * The access token lives only in memory (this store), never in
 * localStorage/sessionStorage — that would expose it to any XSS on the
 * page. The refresh token never touches JS at all; it's an httpOnly
 * cookie the browser sends automatically. On a hard page reload, the
 * access token is re-obtained via POST /auth/refresh (see useAuth).
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isInitializing: true,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  updateUser: (user) => set({ user }),
  clearAuth: () => set({ user: null, accessToken: null }),
  setInitializing: (value) => set({ isInitializing: value }),
}));
