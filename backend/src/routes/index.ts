import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import projectsRoutes from '../modules/projects/projects.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectsRoutes);

// Future modules plug in here, e.g.:
// router.use('/portfolios', portfoliosRoutes);
// router.use('/gallery', galleryRoutes);

export default router;