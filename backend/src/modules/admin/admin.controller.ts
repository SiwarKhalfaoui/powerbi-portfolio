import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import * as adminService from './admin.service';
import { AdminListUsersQuery, AdminListProjectsQuery } from './admin.validation';

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStats();
  return sendSuccess(res, 200, 'Stats retrieved', { stats });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.listUsers(req.query as unknown as AdminListUsersQuery);
  return sendSuccess(res, 200, 'Users retrieved', result);
});

export const setUserSuspended = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await adminService.setUserSuspended(req.params.id, req.body.isSuspended, req.user.id);
  return sendSuccess(res, 200, 'User status updated', { user });
});

export const setUserRole = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await adminService.setUserRole(req.params.id, req.body.role, req.user.id);
  return sendSuccess(res, 200, 'User role updated', { user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await adminService.deleteUser(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'User deleted');
});

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.listAllProjects(req.query as unknown as AdminListProjectsQuery);
  return sendSuccess(res, 200, 'Projects retrieved', result);
});

export const setProjectStatus = asyncHandler(async (req: Request, res: Response) => {
  const project = await adminService.setProjectStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, 'Project status updated', { project });
});