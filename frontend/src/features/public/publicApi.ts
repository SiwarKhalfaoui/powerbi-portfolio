import { api } from '../../lib/axios';
import { ApiEnvelope, PublicPortfolio } from '../../types';

export async function fetchPublicPortfolio(slug: string): Promise<PublicPortfolio> {
  const response = await api.get<ApiEnvelope<{ portfolio: PublicPortfolio }>>(`/public/${slug}`);
  return response.data.data.portfolio;
}