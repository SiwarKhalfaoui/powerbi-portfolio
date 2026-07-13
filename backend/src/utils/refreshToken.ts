import crypto from 'crypto';
import { env } from '../config/env';

/**
 * Refresh tokens are opaque random strings — not JWTs. The client only ever
 * sees the raw token (in an httpOnly cookie); the database only ever stores
 * an HMAC of it. This means a database leak alone cannot be used to forge
 * valid refresh tokens, and a single row lookup is enough to revoke one.
 */

const MS_PER_UNIT: Record<string, number> = {
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export function hashRefreshToken(rawToken: string): string {
  return crypto.createHmac('sha256', env.JWT_REFRESH_SECRET).update(rawToken).digest('hex');
}

/** Parses simple durations like "30d", "15m", "12h" into a future Date. */
export function getExpiryDate(duration: string): Date {
  const match = /^(\d+)([smhd])$/.exec(duration.trim());
  if (!match) {
    throw new Error(`Invalid duration format: "${duration}". Use e.g. "30d", "15m".`);
  }
  const [, amount, unit] = match;
  const ms = Number(amount) * MS_PER_UNIT[unit];
  return new Date(Date.now() + ms);
}

export function getRefreshTokenExpiry(): Date {
  return getExpiryDate(env.JWT_REFRESH_EXPIRES_IN);
}
