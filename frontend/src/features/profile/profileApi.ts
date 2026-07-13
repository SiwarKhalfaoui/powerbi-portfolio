import { api } from '../../lib/axios';
import { ApiEnvelope, User } from '../../types';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  professionalTitle?: string | null;
  bio?: string | null;
  profilePhotoUrl?: string | null;
  country?: string | null;
  city?: string | null;
  languages?: string[];
  skills?: string[];
  availability?: User['availability'];
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function updateProfileRequest(payload: UpdateProfilePayload) {
  const { data } = await api.patch<ApiEnvelope<{ user: User }>>('/users/me', payload);
  return data.data.user;
}

export async function changePasswordRequest(payload: ChangePasswordPayload) {
  await api.patch('/users/me/password', payload);
}
