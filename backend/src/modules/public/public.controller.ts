import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import * as publicService from './public.service';

export const getPortfolio = asyncHandler(async (req: Request, res: Response) => {
  const portfolio = await publicService.getPublicPortfolioBySlug(req.params.slug, req.user?.id);
  return sendSuccess(res, 200, 'Portfolio retrieved', { portfolio });
});

export const getProjectDetail = asyncHandler(async (req: Request, res: Response) => {
  const anonVisitorId =
    typeof req.headers['x-visitor-id'] === 'string' ? req.headers['x-visitor-id'] : undefined;
  const detail = await publicService.getPublicProjectBySlug(
    req.params.slug,
    req.params.projectSlug,
    req.user?.id,
    anonVisitorId,
  );
  return sendSuccess(res, 200, 'Project retrieved', detail);
});