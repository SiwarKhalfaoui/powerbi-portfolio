import { z } from 'zod';
import { BusinessDomain, ProjectType, ProjectLevel } from '@prisma/client';

export const galleryQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  businessDomain: z.nativeEnum(BusinessDomain).optional(),
  projectType: z.nativeEnum(ProjectType).optional(),
  level: z.nativeEnum(ProjectLevel).optional(),
  tool: z.string().trim().max(60).optional(),
  sort: z.enum(['recent', 'popular']).default('recent'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});
export type GalleryQuery = z.infer<typeof galleryQuerySchema>;