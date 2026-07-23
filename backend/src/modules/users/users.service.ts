import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { comparePassword, hashPassword } from '../../utils/password';
import { serializeUser, PublicUser } from '../../utils/serializeUser';
import { generateUniqueUserSlug } from '../../utils/slugify';
import { UpdateProfileInput, ChangePasswordInput } from './users.validation';
import { Experience, Formation, Certification } from '@prisma/client';


export interface UserProfile extends PublicUser {
  experiences: Experience[];
  formations: Formation[];
  certifications: Certification[];
}

export async function getUserById(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      experiences: { orderBy: { startDate: 'desc' } },
      formations: { orderBy: { startDate: 'desc' } },
      certifications: { orderBy: { issueDate: 'desc' } },
    },
  });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return serializeUser(user) as UserProfile;
}

/** Converts empty-string optional fields (from a cleared form input) to null. */
function normalizeOptional(value?: string | null) {
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
      profilePhotoUrl: normalizeOptional(input.profilePhotoUrl),
      linkedinUrl: normalizeOptional(input.linkedinUrl),
      githubUrl: normalizeOptional(input.githubUrl),
      websiteUrl: normalizeOptional(input.websiteUrl),
      publicContactEmail: normalizeOptional(input.publicContactEmail),
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

export async function setPortfolioPublished(
  userId: string,
  published: boolean,
): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Generate the slug lazily, exactly once, the first time the user
  // actually publishes — never on profile edits, never regenerated later.
  let slug = user.slug;
  if (published && !slug) {
    slug = await generateUniqueUserSlug(user.firstName, user.lastName);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { portfolioPublished: published, slug },
  });
  return serializeUser(updated);
}