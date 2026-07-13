import { useCallback } from 'react';
import { useAuthStore } from './authStore';
import * as authApi from './authApi';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const setAuth = useAuthStore((s) => s.setAuth);
  const updateUser = useAuthStore((s) => s.updateUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const register = useCallback(
    async (payload: authApi.RegisterPayload) => {
      const result = await authApi.registerRequest(payload);
      setAuth(result.user, result.accessToken);
      return result.user;
    },
    [setAuth],
  );

  const login = useCallback(
    async (payload: authApi.LoginPayload) => {
      const result = await authApi.loginRequest(payload);
      setAuth(result.user, result.accessToken);
      return result.user;
    },
    [setAuth],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logoutRequest();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isInitializing,
    register,
    login,
    logout,
    updateUser,
  };
}
