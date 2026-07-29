import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import * as galleryService from './gallery.service';
import { GalleryQuery } from './gallery.validation';

export const listGallery = asyncHandler(async (req: Request, res: Response) => {
  const result = await galleryService.listGalleryProjects(req.query as unknown as GalleryQuery);
  return sendSuccess(res, 200, 'Gallery retrieved', result);
});