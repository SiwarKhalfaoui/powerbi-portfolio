import { z } from 'zod';

export const portfolioSlugParamsSchema = z.object({
  slug: z.string().trim().min(1, 'Slug requis'),
});
export type PortfolioSlugParams = z.infer<typeof portfolioSlugParamsSchema>;