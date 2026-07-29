import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authenticateOptional } from '../../middleware/authenticate';
import { portfolioSlugParamsSchema, publicProjectParamsSchema } from './public.validation';
import * as publicController from './public.controller';

const router = Router();

// authenticateOptional (not authenticate): these routes are public by
// design, but need to know whether the requester is the owner previewing
// their own unpublished portfolio.
router.get(
  '/:slug/:projectSlug',
  authenticateOptional,
  validate({ params: publicProjectParamsSchema }),
  publicController.getProjectDetail,
);
router.get(
  '/:slug',
  authenticateOptional,
  validate({ params: portfolioSlugParamsSchema }),
  publicController.getPortfolio,
);

export default router;