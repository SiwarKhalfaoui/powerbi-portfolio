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

  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/** Generates and persists the portfolio slug if the user doesn't have one
 * yet — idempotent, safe to call repeatedly. Shared by setPortfolioPublished
 * (first publish) and previewPortfolio (first preview, before ever
 * publishing): whichever happens first is what actually creates the slug. */
export async function ensurePortfolioSlug(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  if (user.slug) {
    return serializeUser(user);
  }
  const slug = await generateUniqueUserSlug(user.firstName, user.lastName);
  const updated = await prisma.user.update({ where: { id: userId }, data: { slug } });
  return serializeUser(updated);
}

export async function setPortfolioPublished(
  userId: string,
  published: boolean,
): Promise<PublicUser> {
  if (published) {
    await ensurePortfolioSlug(userId);
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { portfolioPublished: published },
  });
  return serializeUser(updated);
}