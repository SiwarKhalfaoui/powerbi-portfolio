import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { ApiError } from '../utils/ApiError';

/**
 * Images are stored on local disk under <backend>/uploads/projects and
 * served statically at /uploads (see app.ts). This keeps local development
 * dependency-free — no cloud storage account required. To move to S3 /
 * Cloudinary / etc. later, swap this `diskStorage` for that provider's
 * multer-compatible storage engine; nothing else in the projects module
 * needs to change, since it only ever deals with the resulting URL.
 *
 * One generic endpoint handles both the cover image and each gallery
 * image — the frontend just calls it once per image and stores the
 * returned URL wherever it needs it.
 */
const UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'projects');
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const uploadProjectImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(ApiError.badRequest('Image must be a JPEG, PNG, WEBP or GIF file.'));
      return;
    }
    cb(null, true);
  },
}).single('image');

/** Relative URL path for a stored file. The controller prepends the request's
 * own origin to this before returning it, since stored image URLs must be
 * absolute (see projects.controller.ts). */
export function projectImageUrlFor(filename: string): string {
  return `/uploads/projects/${filename}`;
}

/** Deletes a previously uploaded image; silently no-ops if it's already gone. */
export function deleteProjectImageFile(imageUrl: string | null | undefined): void {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  const filePath = path.join(UPLOAD_ROOT, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete image file:', err);
    }
  });
}