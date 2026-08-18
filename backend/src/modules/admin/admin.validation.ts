import { z } from 'zod';
import { ProjectStatus, Role } from '@prisma/client';

export const adminListUsersQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type AdminListUsersQuery = z.infer<typeof adminListUsersQuerySchema>;

export const userIdParamsSchema = z.object({
  id: z.string().uuid('Invalid user id'),
});

export const setUserSuspendedSchema = z.object({
  isSuspended: z.boolean(),
});

export const setUserRoleSchema = z.object({
  role: z.nativeEnum(Role),
});
export type SetUserRoleInput = z.infer<typeof setUserRoleSchema>;

export const adminListProjectsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type AdminListProjectsQuery = z.infer<typeof adminListProjectsQuerySchema>;

export const adminProjectIdParamsSchema = z.object({
  id: z.string().uuid('Invalid project id'),
});

export const setProjectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
});