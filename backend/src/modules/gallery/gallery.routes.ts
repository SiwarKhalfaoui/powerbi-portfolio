import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { galleryQuerySchema } from './gallery.validation';
import * as galleryController from './gallery.controller';

const router = Router();

// Deliberately no authenticate() — the gallery is public by design.
router.get('/', validate({ query: galleryQuerySchema }), galleryController.listGallery);

export default router;