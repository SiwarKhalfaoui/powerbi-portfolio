import { z } from 'zod';

export const itemIdParamsSchema = z.object({
  id: z.string().uuid('Invalid id'),
});


export const experienceSchema = z
  .object({
    title: z.string().trim().min(1, 'Le poste est requis').max(150),
    company: z.string().trim().min(1, "L'entreprise est requise").max(150),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional().nullable(),
    isCurrent: z.boolean().default(false),
    description: z.string().trim().max(2000).optional().or(z.literal('')),
  })
  .refine((data) => data.isCurrent || data.endDate, {
    message: 'Indiquez une date de fin, ou cochez "poste actuel"',
    path: ['endDate'],
  });
export type ExperienceInput = z.infer<typeof experienceSchema>;
export const updateExperienceSchema = experienceSchema; 


export const formationSchema = z.object({
  degree: z.string().trim().min(1, 'Le diplôme est requis').max(150),
  institution: z.string().trim().min(1, "L'établissement est requis").max(150),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
});
export type FormationInput = z.infer<typeof formationSchema>;


export const certificationSchema = z.object({
  name: z.string().trim().min(1, 'Le nom de la certification est requis').max(150),
  issuer: z.string().trim().min(1, "L'organisme émetteur est requis").max(150),
  issueDate: z.coerce.date().optional().nullable(),
  credentialUrl: z
    .string()
    .trim()
    .refine((val) => val === '' || z.string().url().safeParse(val).success, {
      message: 'URL invalide',
    })
    .optional()
    .or(z.literal('')),
});
export type CertificationInput = z.infer<typeof certificationSchema>;