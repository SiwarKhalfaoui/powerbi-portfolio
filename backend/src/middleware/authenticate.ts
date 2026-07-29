import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';

/**
 * Reads the "Authorization: Bearer <token>" header, verifies the JWT,
 * and attaches { id, role } to req.user. Protected routes depend on this
 * running first.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or malformed Authorization header'));
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Access token expired'));
    }
    return next(ApiError.unauthorized('Invalid access token'));
  }
}

/**
 * Same JWT check as authenticate(), but never blocks the request — used on
 * public routes that need to know WHO is asking without requiring anyone to
 * be logged in (e.g. portfolio preview: the owner sees more than a
 * stranger, but a stranger must still get a normal response, not a 401).
 * A missing, malformed, or expired token silently falls through as
 * anonymous rather than raising an error.
 */
export function authenticateOptional(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // Invalid/expired token on an optional route: proceed as anonymous
    // rather than failing the request.
  }
  return next();
}