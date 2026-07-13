import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, '8 caractères minimum')
  .regex(/[a-z]/, 'Une minuscule requise')
  .regex(/[A-Z]/, 'Une majuscule requise')
  .regex(/[0-9]/, 'Un chiffre requis');

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est requis'),
  lastName: z.string().trim().min(1, 'Le nom est requis'),
  email: z.string().trim().email('Adresse email invalide'),
  password: passwordSchema,
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.string().trim().email('Adresse email invalide'),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const resetPasswordFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirmez le mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;