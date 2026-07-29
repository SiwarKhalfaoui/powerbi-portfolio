import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import * as publicService from './public.service';

export const getPortfolio = asyncHandler(async (req: Request, res: Response) => {
  const portfolio = await publicService.getPublicPortfolioBySlug(req.params.slug, req.user?.id);
  return sendSuccess(res, 200, 'Portfolio retrieved', { portfolio });
});

export const getProjectDetail = asyncHandler(async (req: Request, res: Response) => {
  const detail = await publicService.getPublicProjectBySlug(
    req.params.slug,
    req.params.projectSlug,
    req.user?.id,
  );
  return sendSuccess(res, 200, 'Project retrieved', detail);
});