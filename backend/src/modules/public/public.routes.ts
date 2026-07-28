import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { portfolioSlugParamsSchema, publicProjectParamsSchema } from './public.validation';
import * as publicController from './public.controller';

const router = Router();

// Deliberately no authenticate() — this module is public by design.
router.get(
  '/:slug/:projectSlug',
  validate({ params: publicProjectParamsSchema }),
  publicController.getProjectDetail,
);
router.get('/:slug', validate({ params: portfolioSlugParamsSchema }), publicController.getPortfolio);

export default router;