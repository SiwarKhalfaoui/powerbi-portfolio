import { Response } from 'express';
import { env } from '../config/env';
import { getRefreshTokenExpiry } from './refreshToken';

export const REFRESH_COOKIE_NAME = 'drd_refresh_token';

export function setRefreshTokenCookie(res: Response, rawToken: string) {
  res.cookie(REFRESH_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/api/auth',
    expires: getRefreshTokenExpiry(),
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/api/auth',
  });
}
