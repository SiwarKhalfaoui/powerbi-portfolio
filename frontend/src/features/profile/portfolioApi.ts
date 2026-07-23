import { api } from '../../lib/axios';
import { ApiEnvelope, User } from '../../types';

export async function setPortfolioPublishedRequest(portfolioPublished: boolean): Promise<User> {
  const { data } = await api.patch<ApiEnvelope<{ user: User }>>('/users/me/portfolio', {
    portfolioPublished,
  });
  return data.data.user;
}