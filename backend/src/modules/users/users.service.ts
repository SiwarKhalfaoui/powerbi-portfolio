import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { comparePassword, hashPassword } from '../../utils/password';
import { serializeUser, PublicUser } from '../../utils/serializeUser';
import { UpdateProfileInput, ChangePasswordInput } from './users.validation';

export async function getUserById(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return serializeUser(user);
}

/** Converts empty-string URL fields (from a cleared form input) to null. */
function normalizeOptionalUrl(value?: string | null) {
  if (value === undefined) return undefined;
  return value === '' ? null : value;
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<PublicUser> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...input,
      profilePhotoUrl: normalizeOptionalUrl(input.profilePhotoUrl),
      linkedinUrl: normalizeOptionalUrl(input.linkedinUrl),
      githubUrl: normalizeOptionalUrl(input.githubUrl),
      websiteUrl: normalizeOptionalUrl(input.websiteUrl),
    },
  });
  return serializeUser(user);
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isValid = await comparePassword(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const passwordHash = await hashPassword(input.newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  // Revoke all existing refresh tokens so other sessions must re-authenticate.
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
