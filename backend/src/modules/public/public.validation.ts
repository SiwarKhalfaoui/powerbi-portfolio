import { z } from 'zod';

export const portfolioSlugParamsSchema = z.object({
  slug: z.string().trim().min(1, 'Slug requis'),
});
export type PortfolioSlugParams = z.infer<typeof portfolioSlugParamsSchema>;


export const publicProjectParamsSchema = z.object({
  slug: z.string().trim().min(1, 'Slug utilisateur requis'),
  projectSlug: z.string().trim().min(1, 'Slug de projet requis'),
});
export type PublicProjectParams = z.infer<typeof publicProjectParamsSchema>;