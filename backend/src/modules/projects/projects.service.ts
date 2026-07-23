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
  // Ordered by the user's own portfolio order (doc Module 3), not just
  // recency — this view is what they use to decide/see that order.
  return prisma.project.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  });
}

async function getOwnedProjectOr404(id: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw ApiError.notFound('Project not found');
  }
  if (project.userId !== userId) {
  
    throw ApiError.notFound('Project not found');
  }
  return project;
}

export async function getMyProjectById(id: string, userId: string) {
  return getOwnedProjectOr404(id, userId);
}

export async function createProject(userId: string, input: CreateProjectInput) {
  const slug = await generateUniqueProjectSlug(input.title);

  const existingCount = await prisma.project.count({ where: { userId } });

  return prisma.project.create({
    data: {
      ...nullifyEmptyStrings(input),
      slug,
      userId,
      order: existingCount,
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


export async function reorderProjects(userId: string, orderedIds: string[]): Promise<void> {
  const myProjects = await prisma.project.findMany({
    where: { userId },
    select: { id: true },
  });
  const myIds = new Set(myProjects.map((p) => p.id));

  const isValidReorder =
    orderedIds.length === myIds.size && orderedIds.every((id) => myIds.has(id));
  if (!isValidReorder) {
    throw ApiError.badRequest('orderedIds must contain exactly all of your project ids, once each');
  }

  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.project.update({ where: { id }, data: { order: index } })),
  );
}