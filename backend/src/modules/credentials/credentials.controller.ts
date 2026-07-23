import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import * as credentialsService from './credentials.service';

function requireUser(req: Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

// ── Experiences ──────────────────────────────────────────────────────────

export const listExperiences = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const experiences = await credentialsService.listExperiences(user.id);
  return sendSuccess(res, 200, 'Experiences retrieved', { experiences });
});

export const createExperience = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const experience = await credentialsService.createExperience(user.id, req.body);
  return sendSuccess(res, 201, 'Experience added', { experience });
});

export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const experience = await credentialsService.updateExperience(req.params.id, user.id, req.body);
  return sendSuccess(res, 200, 'Experience updated', { experience });
});

export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  await credentialsService.deleteExperience(req.params.id, user.id);
  return sendSuccess(res, 200, 'Experience deleted');
});

// ── Formations ───────────────────────────────────────────────────────────

export const listFormations = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const formations = await credentialsService.listFormations(user.id);
  return sendSuccess(res, 200, 'Formations retrieved', { formations });
});

export const createFormation = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const formation = await credentialsService.createFormation(user.id, req.body);
  return sendSuccess(res, 201, 'Formation added', { formation });
});

export const updateFormation = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const formation = await credentialsService.updateFormation(req.params.id, user.id, req.body);
  return sendSuccess(res, 200, 'Formation updated', { formation });
});

export const deleteFormation = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  await credentialsService.deleteFormation(req.params.id, user.id);
  return sendSuccess(res, 200, 'Formation deleted');
});

// ── Certifications ───────────────────────────────────────────────────────

export const listCertifications = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const certifications = await credentialsService.listCertifications(user.id);
  return sendSuccess(res, 200, 'Certifications retrieved', { certifications });
});

export const createCertification = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const certification = await credentialsService.createCertification(user.id, req.body);
  return sendSuccess(res, 201, 'Certification added', { certification });
});

export const updateCertification = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const certification = await credentialsService.updateCertification(
    req.params.id,
    user.id,
    req.body,
  );
  return sendSuccess(res, 200, 'Certification updated', { certification });
});

export const deleteCertification = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  await credentialsService.deleteCertification(req.params.id, user.id);
  return sendSuccess(res, 200, 'Certification deleted');
});