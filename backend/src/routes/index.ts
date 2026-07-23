import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import projectsRoutes from '../modules/projects/projects.routes';
import credentialsRoutes from '../modules/credentials/credentials.routes';
import publicRoutes from '../modules/public/public.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/users/me', credentialsRoutes);
router.use('/projects', projectsRoutes);
router.use('/public', publicRoutes);

// Future modules plug in here, e.g.:
// router.use('/gallery', galleryRoutes);

export default router;