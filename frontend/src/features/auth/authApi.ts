import { api } from '../../lib/axios';
import { ApiEnvelope, AuthResponseData, User } from '../../types';

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await api.post<ApiEnvelope<AuthResponseData>>('/auth/register', payload);
  return data.data;
}

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<ApiEnvelope<AuthResponseData>>('/auth/login', payload);
  return data.data;
}

export async function googleAuthRequest(idToken: string) {
  const { data } = await api.post<ApiEnvelope<AuthResponseData>>('/auth/google', { idToken });
  return data.data;
}

export async function refreshRequest() {
  const { data } = await api.post<ApiEnvelope<AuthResponseData>>('/auth/refresh');
  return data.data;
}

export async function logoutRequest() {
  await api.post('/auth/logout');
}

export async function forgotPasswordRequest(email: string) {
  const { data } = await api.post<ApiEnvelope<null>>('/auth/forgot-password', { email });
  return data.message;
}

export async function resetPasswordRequest(payload: { token: string; newPassword: string }) {
  const { data } = await api.post<ApiEnvelope<null>>('/auth/reset-password', payload);
  return data.message;
}

export async function fetchMe() {
  const { data } = await api.get<ApiEnvelope<{ user: User }>>('/users/me');
  return data.data.user;
}