import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../features/auth/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  withCredentials: true, // send the httpOnly refresh cookie
});

// Attach the in-memory access token to every request.
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const { user, accessToken } = response.data.data;
    useAuthStore.getState().setAuth(user, accessToken);
    return accessToken as string;
  } catch {
    useAuthStore.getState().clearAuth();
    return null;
  }
}

// On a 401 (expired access token), try exactly one silent refresh, then
// retry the original request. Multiple simultaneous 401s share one
// in-flight refresh call instead of firing a refresh burst.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
