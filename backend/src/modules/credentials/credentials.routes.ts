import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import {
  experienceSchema,
  updateExperienceSchema,
  formationSchema,
  certificationSchema,
  itemIdParamsSchema,
} from './credentials.validation';
import * as credentialsController from './credentials.controller';

const router = Router();

router.use(authenticate);

router.get('/experiences', credentialsController.listExperiences);
router.post(
  '/experiences',
  validate({ body: experienceSchema }),
  credentialsController.createExperience,
);
router.patch(
  '/experiences/:id',
  validate({ params: itemIdParamsSchema, body: updateExperienceSchema }),
  credentialsController.updateExperience,
);
router.delete(
  '/experiences/:id',
  validate({ params: itemIdParamsSchema }),
  credentialsController.deleteExperience,
);

router.get('/formations', credentialsController.listFormations);
router.post(
  '/formations',
  validate({ body: formationSchema }),
  credentialsController.createFormation,
);
router.patch(
  '/formations/:id',
  validate({ params: itemIdParamsSchema, body: formationSchema }),
  credentialsController.updateFormation,
);
router.delete(
  '/formations/:id',
  validate({ params: itemIdParamsSchema }),
  credentialsController.deleteFormation,
);

router.get('/certifications', credentialsController.listCertifications);
router.post(
  '/certifications',
  validate({ body: certificationSchema }),
  credentialsController.createCertification,
);
router.patch(
  '/certifications/:id',
  validate({ params: itemIdParamsSchema, body: certificationSchema }),
  credentialsController.updateCertification,
);
router.delete(
  '/certifications/:id',
  validate({ params: itemIdParamsSchema }),
  credentialsController.deleteCertification,
);

export default router;