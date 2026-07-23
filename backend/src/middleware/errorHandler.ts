import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import multer from 'multer';
import { ApiError } from '../utils/ApiError';
import { isProduction } from '../config/env';

/**
 * Single place that turns any thrown error into a consistent JSON response.
 * Must be registered LAST, after all routes.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Known, intentional errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  // Request validation errors (zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
  }

  // Known Prisma errors (e.g. unique constraint violations)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A record with this value already exists',
        details: err.meta,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }
  }

  // File upload errors (wrong type is already an ApiError from fileFilter;
  // this catches size-limit and other Multer-specific failures)
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image is too large. Maximum size is 5MB.'
        : `Upload error: ${err.message}`;
    return res.status(400).json({ success: false, message });
  }

  // Anything else is unexpected — log full detail server-side only
  console.error('🔥 Unhandled error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}