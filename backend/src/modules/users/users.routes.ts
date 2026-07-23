import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { updateProfileSchema, changePasswordSchema, publishPortfolioSchema } from './users.validation';
import * as usersController from './users.controller';

const router = Router();

router.use(authenticate); // every route below requires a valid access token

router.get('/me', usersController.getMe);
router.patch('/me', validate({ body: updateProfileSchema }), usersController.updateMe);
router.patch(
  '/me/password',
  validate({ body: changePasswordSchema }),
  usersController.changeMyPassword,
);
router.patch(
  '/me/portfolio',
  validate({ body: publishPortfolioSchema }),
  usersController.publishPortfolio,
);

export default router;