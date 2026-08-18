import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

/**
 * Runs after authenticate(). Blocks any non-ADMIN caller with 403.
 * Never runs alone — always authenticate, then requireAdmin.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }
  if (req.user.role !== Role.ADMIN) {
    return next(ApiError.forbidden('Admin access required'));
  }
  return next();
}