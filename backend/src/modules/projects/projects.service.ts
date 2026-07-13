import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { generateUniqueProjectSlug } from '../../utils/slugify';
import { deleteProjectImageFile } from '../../middleware/upload';
import { CreateProjectInput, UpdateProjectInput } from './projects.validation';
import { Project } from '@prisma/client';

/** Empty-string fields from a cleared form input should clear the column, not write "". */
function nullifyEmptyStrings<T extends Record<string, unknown>>(input: T): T {
  const result = { ...input };
  for (const key of Object.keys(result)) {
    if (result[key] === '') {
      (result as Record<string, unknown>)[key] = null;
    }
  }
  return result;
}

/** Deletes any image files that are no longer referenced after a project is updated or removed. */
function cleanupReplacedImages(existing: Project, next: { coverImageUrl?: string | null; galleryImageUrls?: string[] }) {
  if (next.coverImageUrl !== undefined && next.coverImageUrl !== existing.coverImageUrl) {
    deleteProjectImageFile(existing.coverImageUrl);
  }
  if (next.galleryImageUrls !== undefined) {
    const removed = existing.galleryImageUrls.filter((url) => !next.galleryImageUrls!.includes(url));
    removed.forEach(deleteProjectImageFile);
  }
}

export async function listMyProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

async function getOwnedProjectOr404(id: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw ApiError.notFound('Project not found');
  }
  if (project.userId !== userId) {
    // 404 rather than 403 — don't reveal that a project with this id
    // exists at all to someone who doesn't own it.
    throw ApiError.notFound('Project not found');
  }
  return project;
}

export async function getMyProjectById(id: string, userId: string) {
  return getOwnedProjectOr404(id, userId);
}

export async function createProject(userId: string, input: CreateProjectInput) {
  const slug = await generateUniqueProjectSlug(input.title);

  return prisma.project.create({
    data: {
      ...nullifyEmptyStrings(input),
      slug,
      userId,
    },
  });
}

export async function updateProject(id: string, userId: string, input: UpdateProjectInput) {
  const existing = await getOwnedProjectOr404(id, userId);
  const data = nullifyEmptyStrings(input);

  // Enforce against the merged (existing + incoming) state, not just the
  // incoming diff — see the comment in projects.validation.ts for why this
  // can't be a simple zod .refine() on a partial update.
  const finalInteractiveLink =
    data.interactiveLink !== undefined ? data.interactiveLink : existing.interactiveLink;
  const finalOwnershipConfirmed =
    data.ownershipConfirmed !== undefined ? data.ownershipConfirmed : existing.ownershipConfirmed;
  if (finalInteractiveLink && !finalOwnershipConfirmed) {
    throw ApiError.badRequest(
      'You must confirm you own the rights to this report before attaching a link',
    );
  }

  cleanupReplacedImages(existing, data);

  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string, userId: string) {
  const existing = await getOwnedProjectOr404(id, userId);
  await prisma.project.delete({ where: { id } });
  deleteProjectImageFile(existing.coverImageUrl);
  existing.galleryImageUrls.forEach(deleteProjectImageFile);
}