import { z } from 'zod';
import { Availability } from '@prisma/client';

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  professionalTitle: z.string().trim().max(120).optional().nullable(),
  bio: z.string().trim().max(2000).optional().nullable(),
  profilePhotoUrl: z.string().url().optional().nullable().or(z.literal('')),
  country: z.string().trim().max(80).optional().nullable(),
  city: z.string().trim().max(80).optional().nullable(),
  languages: z.array(z.string().trim().min(1)).max(20).optional(),
  skills: z.array(z.string().trim().min(1)).max(40).optional(),
  availability: z.nativeEnum(Availability).optional(),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  websiteUrl: z.string().url().optional().nullable().or(z.literal('')),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
