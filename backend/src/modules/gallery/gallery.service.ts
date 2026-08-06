import { prisma } from '../../config/prisma';
import { ProjectStatus, Prisma } from '@prisma/client';
import { GalleryQuery } from './gallery.validation';

export interface GalleryProjectOwner {
  slug: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
}

export async function listGalleryProjects(query: GalleryQuery) {
  const { search, businessDomain, projectType, level, tool, tag, sort, page, limit } = query;

  const where: Prisma.ProjectWhereInput = {
    status: ProjectStatus.PUBLISHED,
    user: { portfolioPublished: true },
  };

  if (businessDomain) where.businessDomain = businessDomain;
  if (projectType) where.projectType = projectType;
  if (level) where.level = level;
  if (tool) where.toolsUsed = { has: tool };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (tag) {
    const normalizedTag = tag.trim().toLowerCase();
    const matches = await prisma.$queryRaw<{ id: string }[]>(
      Prisma.sql`SELECT id FROM projects WHERE EXISTS (
        SELECT 1 FROM unnest(tags) AS t WHERE lower(trim(t)) = ${normalizedTag}
      )`,
    );
    const matchingIds = matches.map((m) => m.id);
    if (matchingIds.length === 0) {
      return { projects: [], total: 0, page, limit };
    }
    where.id = { in: matchingIds };
  }

  const orderBy: Prisma.ProjectOrderByWithRelationInput =
    sort === 'popular' ? { viewCount: 'desc' } : { createdAt: 'desc' };

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { slug: true, firstName: true, lastName: true, profilePhotoUrl: true },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects: projects.map((p) => {
      const { user, ...project } = p;
      return { ...project, owner: user as GalleryProjectOwner };
    }),
    total,
    page,
    limit,
  };
}