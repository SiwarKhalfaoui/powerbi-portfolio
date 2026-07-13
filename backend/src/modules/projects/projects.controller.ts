import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { projectImageUrlFor } from '../../middleware/upload';
import * as projectsService from './projects.service';

export const listMine = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const projects = await projectsService.listMyProjects(req.user.id);
  return sendSuccess(res, 200, 'Projects retrieved', { projects });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const project = await projectsService.getMyProjectById(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'Project retrieved', { project });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const project = await projectsService.createProject(req.user.id, req.body);
  return sendSuccess(res, 201, 'Project created', { project });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const project = await projectsService.updateProject(req.params.id, req.user.id, req.body);
  return sendSuccess(res, 200, 'Project updated', { project });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await projectsService.deleteProject(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'Project deleted');
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No image file provided');
  // create/updateProjectSchema validate image URLs with z.string().url(),
  // which requires an absolute URL — a bare "/uploads/..." path would fail
  // that check, so the full origin is prepended here.
  const url = `${req.protocol}://${req.get('host')}${projectImageUrlFor(req.file.filename)}`;
  return sendSuccess(res, 201, 'Image uploaded', { url });
});