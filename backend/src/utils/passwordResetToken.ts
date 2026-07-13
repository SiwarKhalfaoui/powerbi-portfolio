import crypto from 'crypto';
import { env } from '../config/env';
import { getExpiryDate } from './refreshToken';

/**
 * Same principle as refresh tokens: the raw token is only ever emailed to
 * the user. The database stores only an HMAC of it, using a secret
 * dedicated to password resets (distinct from the refresh-token secret) so
 * the two token families can't be confused or replayed against each other.
 */

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHmac('sha256', env.PASSWORD_RESET_SECRET).update(rawToken).digest('hex');
}

export function getResetTokenExpiry(): Date {
  return getExpiryDate(env.PASSWORD_RESET_TOKEN_EXPIRES_IN);
}