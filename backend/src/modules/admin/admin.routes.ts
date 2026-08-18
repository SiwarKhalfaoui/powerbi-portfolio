import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';
import { validate } from '../../middleware/validate';
import * as adminController from './admin.controller';
import {
  adminListUsersQuerySchema,
  userIdParamsSchema,
  setUserSuspendedSchema,
  setUserRoleSchema,
  adminListProjectsQuerySchema,
  adminProjectIdParamsSchema,
  setProjectStatusSchema,
} from './admin.validation';

const router = Router();

router.use(authenticate, requireAdmin); // every route below requires an ADMIN account

router.get('/stats', adminController.getStats);

router.get('/users', validate({ query: adminListUsersQuerySchema }), adminController.listUsers);
router.patch(
  '/users/:id/status',
  validate({ params: userIdParamsSchema, body: setUserSuspendedSchema }),
  adminController.setUserSuspended,
);
router.patch(
  '/users/:id/role',
  validate({ params: userIdParamsSchema, body: setUserRoleSchema }),
  adminController.setUserRole,
);
router.delete('/users/:id', validate({ params: userIdParamsSchema }), adminController.deleteUser);

router.get('/projects', validate({ query: adminListProjectsQuerySchema }), adminController.listProjects);
router.patch(
  '/projects/:id/status',
  validate({ params: adminProjectIdParamsSchema, body: setProjectStatusSchema }),
  adminController.setProjectStatus,
);

export default router;