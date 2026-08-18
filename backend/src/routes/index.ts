import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import projectsRoutes from '../modules/projects/projects.routes';
import credentialsRoutes from '../modules/credentials/credentials.routes';
import publicRoutes from '../modules/public/public.routes';
import galleryRoutes from '../modules/gallery/gallery.routes';
import adminRoutes from '../modules/admin/admin.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/users/me', credentialsRoutes);
router.use('/projects', projectsRoutes);
router.use('/public', publicRoutes);
router.use('/gallery', galleryRoutes);
router.use('/admin', adminRoutes);

export default router;