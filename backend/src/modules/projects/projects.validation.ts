import { z } from 'zod';
import { ProjectType, ProjectLevel, ProjectStatus } from '@prisma/client';

export const projectIdParamsSchema = z.object({
  id: z.string().uuid('Invalid project id'),
});

const urlOrEmpty = z
  .string()
  .trim()
  .refine((val) => val === '' || z.string().url().safeParse(val).success, {
    message: 'URL invalide',
  });

export const createProjectSchema = z
  .object({
    title: z.string().trim().min(1, 'Le titre est requis').max(150),
    shortDescription: z.string().trim().max(280).optional().or(z.literal('')),
    description: z.string().trim().max(5000).optional().or(z.literal('')),
    businessDomain: z.string().trim().max(80).optional().or(z.literal('')),
    projectType: z.nativeEnum(ProjectType).default(ProjectType.DASHBOARD),
    toolsUsed: z.array(z.string().trim().min(1)).max(20).default([]),
    level: z.nativeEnum(ProjectLevel).default(ProjectLevel.BEGINNER),
    coverImageUrl: urlOrEmpty.optional(),
    galleryImageUrls: z.array(z.string().url()).max(10).default([]),
    interactiveLink: urlOrEmpty.optional(),
    ownershipConfirmed: z.boolean().default(false),
    videoUrl: urlOrEmpty.optional(),
    datasetUrl: urlOrEmpty.optional(),
    results: z.string().trim().max(2000).optional().or(z.literal('')),
    tags: z.array(z.string().trim().min(1)).max(20).default([]),
    status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),
  })
  .refine((data) => !data.interactiveLink || data.ownershipConfirmed, {
    // Mirrors the doc's rule: a report link cannot be attached without the
    // user explicitly confirming they own the rights to that report.
    message: 'You must confirm you own the rights to this report before attaching a link',
    path: ['ownershipConfirmed'],
  });
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Same shape, but every field is optional (partial update) — re-declared
// rather than `.partial()` on the refined schema, since zod doesn't allow
// `.partial()` after `.refine()`. Note: the ownership-confirmation rule
// isn't enforced here, because a partial update only sees the fields being
// changed, not the full row — that check happens in projects.service.ts
// against the merged (existing + incoming) state instead.
export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
  shortDescription: z.string().trim().max(280).optional().or(z.literal('')),
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  businessDomain: z.string().trim().max(80).optional().or(z.literal('')),
  projectType: z.nativeEnum(ProjectType).optional(),
  toolsUsed: z.array(z.string().trim().min(1)).max(20).optional(),
  level: z.nativeEnum(ProjectLevel).optional(),
  coverImageUrl: urlOrEmpty.optional(),
  galleryImageUrls: z.array(z.string().url()).max(10).optional(),
  interactiveLink: urlOrEmpty.optional(),
  ownershipConfirmed: z.boolean().optional(),
  videoUrl: urlOrEmpty.optional(),
  datasetUrl: urlOrEmpty.optional(),
  results: z.string().trim().max(2000).optional().or(z.literal('')),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
});
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;