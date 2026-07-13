import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { uploadProjectImage } from '../../middleware/upload';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamsSchema,
} from './projects.validation';
import * as projectsController from './projects.controller';

const router = Router();

router.use(authenticate); // every project route is owner-only for now

router.get('/me', projectsController.listMine);
router.post('/upload-image', uploadProjectImage, projectsController.uploadImage);

router.post('/', validate({ body: createProjectSchema }), projectsController.create);
router.get('/:id', validate({ params: projectIdParamsSchema }), projectsController.getOne);
router.patch(
  '/:id',
  validate({ params: projectIdParamsSchema, body: updateProjectSchema }),
  projectsController.update,
);
router.delete('/:id', validate({ params: projectIdParamsSchema }), projectsController.remove);

export default router;