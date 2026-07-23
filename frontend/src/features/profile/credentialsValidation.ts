import { z } from 'zod';

export const experienceFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Le poste est requis').max(150),
    company: z.string().trim().min(1, "L'entreprise est requise").max(150),
    startDate: z.string().min(1, 'Date de début requise'),
    endDate: z.string().optional().or(z.literal('')),
    isCurrent: z.boolean(),
    description: z.string().trim().max(2000).optional().or(z.literal('')),
  })
  .refine((data) => data.isCurrent || data.endDate, {
    message: 'Indiquez une date de fin, ou cochez "poste actuel"',
    path: ['endDate'],
  });
export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export const formationFormSchema = z.object({
  degree: z.string().trim().min(1, 'Le diplôme est requis').max(150),
  institution: z.string().trim().min(1, "L'établissement est requis").max(150),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  isCurrent: z.boolean(),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
});
export type FormationFormValues = z.infer<typeof formationFormSchema>;

export const certificationFormSchema = z.object({
  name: z.string().trim().min(1, 'Le nom de la certification est requis').max(150),
  issuer: z.string().trim().min(1, "L'organisme émetteur est requis").max(150),
  issueDate: z.string().optional().or(z.literal('')),
  credentialUrl: z
    .string()
    .trim()
    .refine((val) => val === '' || z.string().url().safeParse(val).success, {
      message: 'URL invalide',
    })
    .optional()
    .or(z.literal('')),
});
export type CertificationFormValues = z.infer<typeof certificationFormSchema>;