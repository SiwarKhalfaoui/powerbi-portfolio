import { z } from 'zod';

const urlOrEmpty = z
  .string()
  .trim()
  .refine((val) => val === '' || z.string().url().safeParse(val).success, {
    message: 'URL invalide',
  });

export const projectFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Le titre est requis').max(150),
    shortDescription: z.string().trim().max(280).optional().or(z.literal('')),
    description: z.string().trim().max(5000).optional().or(z.literal('')),
    businessDomain: z.string().trim().max(80).optional().or(z.literal('')),
    projectType: z.enum(['DASHBOARD', 'REPORT', 'ANALYSIS', 'TEMPLATE', 'CASE_STUDY']),
    toolsUsed: z.string().max(300).optional().or(z.literal('')), // comma-separated in the UI
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    interactiveLink: urlOrEmpty,
    ownershipConfirmed: z.boolean(),
    videoUrl: urlOrEmpty,
    datasetUrl: urlOrEmpty,
    results: z.string().trim().max(2000).optional().or(z.literal('')),
    tags: z.string().max(300).optional().or(z.literal('')), // comma-separated in the UI
    status: z.enum(['DRAFT', 'PUBLISHED', 'PRIVATE', 'ARCHIVED']),
  })
  .refine((data) => !data.interactiveLink || data.ownershipConfirmed, {
    message: 'Confirmez que vous détenez les droits sur ce rapport avant d’ajouter un lien',
    path: ['ownershipConfirmed'],
  });
export type ProjectFormValues = z.infer<typeof projectFormSchema>;

function csvToArray(value?: string): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function arrayToCsv(items: string[]): string {
  return items.join(', ');
}

/** Converts flat form values (+ image state kept separately) into the API payload shape.
 * Empty optional fields are sent as "" (not null) — this matches what
 * backend/projects.validation.ts actually accepts (.or(z.literal(''))). */
export function toProjectPayload(
  values: ProjectFormValues,
  images: { coverImageUrl: string | null; galleryImageUrls: string[] },
) {
  return {
    title: values.title,
    shortDescription: values.shortDescription || '',
    description: values.description || '',
    businessDomain: values.businessDomain || '',
    projectType: values.projectType,
    toolsUsed: csvToArray(values.toolsUsed),
    level: values.level,
    coverImageUrl: images.coverImageUrl || '',
    galleryImageUrls: images.galleryImageUrls,
    interactiveLink: values.interactiveLink || '',
    ownershipConfirmed: values.ownershipConfirmed,
    videoUrl: values.videoUrl || '',
    datasetUrl: values.datasetUrl || '',
    results: values.results || '',
    tags: csvToArray(values.tags),
    status: values.status,
  };
}