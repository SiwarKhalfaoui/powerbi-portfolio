import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .refine((val) => val === '' || z.string().url().safeParse(val).success, {
    message: 'URL invalide',
  });

const optionalEmail = z
  .string()
  .trim()
  .refine((val) => val === '' || z.string().email().safeParse(val).success, {
    message: 'Adresse email invalide',
  });

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est requis').max(80),
  lastName: z.string().trim().min(1, 'Le nom est requis').max(80),
  professionalTitle: z.string().trim().max(120).optional().or(z.literal('')),
  bio: z.string().trim().max(2000).optional().or(z.literal('')),
  country: z.string().trim().max(80).optional().or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  languages: z.string().max(300).optional().or(z.literal('')), // comma-separated in the UI
  skills: z.string().max(500).optional().or(z.literal('')), // comma-separated in the UI
  services: z.string().max(500).optional().or(z.literal('')), // comma-separated in the UI
  availability: z.enum(['FREELANCE', 'CDI', 'STAGE', 'CONSULTANT', 'NOT_SPECIFIED']),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  websiteUrl: optionalUrl,
  publicContactEmail: optionalEmail,
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z
      .string()
      .min(8, '8 caractères minimum')
      .regex(/[a-z]/, 'Une minuscule requise')
      .regex(/[A-Z]/, 'Une majuscule requise')
      .regex(/[0-9]/, 'Un chiffre requis'),
    confirmPassword: z.string().min(1, 'Confirmez le nouveau mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });
export type PasswordFormValues = z.infer<typeof passwordFormSchema>;