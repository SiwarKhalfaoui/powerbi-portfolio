import { api } from './axios';
import { ApiEnvelope } from '../types';

/**
 * Generic image upload — despite living under /api/projects/upload-image on
 * the backend (that's where this endpoint was first built), it just saves
 * any image and returns its URL, so it's reused here for profile photos too.
 */
export async function uploadImageRequest(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post<ApiEnvelope<{ url: string }>>('/projects/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.url;
}