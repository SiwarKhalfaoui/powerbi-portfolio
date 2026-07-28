import { api } from '../../lib/axios';
import { ApiEnvelope, PublicPortfolio, PublicProjectDetail } from '../../types';

export async function fetchPublicPortfolio(slug: string): Promise<PublicPortfolio> {
  const response = await api.get<ApiEnvelope<{ portfolio: PublicPortfolio }>>(`/public/${slug}`);
  return response.data.data.portfolio;
}

export async function fetchPublicProject(slug: string, projectSlug: string): Promise<PublicProjectDetail> {
  const response = await api.get<ApiEnvelope<PublicProjectDetail>>(`/public/${slug}/${projectSlug}`);
  return response.data.data;
}