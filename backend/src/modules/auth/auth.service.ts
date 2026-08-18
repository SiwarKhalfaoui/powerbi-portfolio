import { Response } from 'express';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { comparePassword, hashPassword } from '../../utils/password';
import { signAccessToken } from '../../utils/jwt';
import {
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
} from '../../utils/refreshToken';
import {
  generateResetToken,
  hashResetToken,
  getResetTokenExpiry,
} from '../../utils/passwordResetToken';
import { sendPasswordResetEmail } from '../../services/email.service';
import { setRefreshTokenCookie, clearRefreshTokenCookie, REFRESH_COOKIE_NAME } from '../../utils/cookies';
import { serializeUser, PublicUser } from '../../utils/serializeUser';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from './auth.validation';

interface AuthResult {
  user: PublicUser;
  accessToken: string;
}

/** Creates the refresh token row + sets the httpOnly cookie on the response. */
async function issueRefreshToken(res: Response, userId: string, userAgent?: string) {
  const rawToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashRefreshToken(rawToken),
      userId,
      userAgent,
      expiresAt: getRefreshTokenExpiry(),
    },
  });
  setRefreshTokenCookie(res, rawToken);
}

export async function registerUser(
  input: RegisterInput,
  res: Response,
  userAgent?: string,
): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  await issueRefreshToken(res, user.id, userAgent);

  return { user: serializeUser(user), accessToken };
}

export async function loginUser(
  input: LoginInput,
  res: Response,
  userAgent?: string,
): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.isSuspended) {
    throw ApiError.forbidden('This account has been suspended. Please contact support.');
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  await issueRefreshToken(res, user.id, userAgent);

  return { user: serializeUser(user), accessToken };
}

export async function refreshSession(
  rawToken: string | undefined,
  res: Response,
  userAgent?: string,
): Promise<AuthResult> {
  if (!rawToken) {
    throw ApiError.unauthorized('No refresh token provided');
  }

  const tokenHash = hashRefreshToken(rawToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Session expired. Please log in again.');
  }

  if (stored.user.isSuspended) {
    // Revoke this refresh token too, so a suspended account can't keep
    // retrying refresh with the same cookie.
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    clearRefreshTokenCookie(res);
    throw ApiError.forbidden('This account has been suspended. Please contact support.');
  }

  // Rotate: revoke the used token and issue a brand new one.
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const accessToken = signAccessToken({ userId: stored.user.id, role: stored.user.role });
  await issueRefreshToken(res, stored.user.id, userAgent);

  return { user: serializeUser(stored.user), accessToken };
}

export async function logoutUser(rawToken: string | undefined, res: Response): Promise<void> {
  if (rawToken) {
    const tokenHash = hashRefreshToken(rawToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  clearRefreshTokenCookie(res);
}

/**
 * Always resolves the same way whether or not the email exists — the
 * controller returns one generic message either way. This prevents an
 * attacker from using this endpoint to discover which emails are registered.
 */
export async function requestPasswordReset(input: ForgotPasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) return;

  // Invalidate any still-usable previous reset tokens for this user first,
  // so only the most recently requested link is ever valid.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const rawToken = generateResetToken();
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashResetToken(rawToken),
      userId: user.id,
      expiresAt: getResetTokenExpiry(),
    },
  });

  const resetLink = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetLink);
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const tokenHash = hashResetToken(input.token);
  const stored = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
    throw ApiError.badRequest('This reset link is invalid or has expired. Please request a new one.');
  }

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.$transaction([
    prisma.user.update({ where: { id: stored.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    }),
    // A password reset should kill every existing session, same as a
    // deliberate password change — especially important here since it's
    // the recovery path from a potentially compromised account.
    prisma.refreshToken.updateMany({
      where: { userId: stored.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

export { REFRESH_COOKIE_NAME };