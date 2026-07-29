import { api } from '../../lib/axios';
import { ApiEnvelope, GalleryFilters, GalleryResult } from '../../types';

export async function fetchGallery(filters: GalleryFilters): Promise<GalleryResult> {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.businessDomain) params.businessDomain = filters.businessDomain;
  if (filters.projectType) params.projectType = filters.projectType;
  if (filters.level) params.level = filters.level;
  if (filters.tool) params.tool = filters.tool;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = String(filters.page);

  const response = await api.get<ApiEnvelope<GalleryResult>>('/gallery', { params });
  return response.data.data;
}