import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import * as publicService from './public.service';

export const getPortfolio = asyncHandler(async (req: Request, res: Response) => {
  const portfolio = await publicService.getPublicPortfolioBySlug(req.params.slug);
  return sendSuccess(res, 200, 'Portfolio retrieved', { portfolio });
});