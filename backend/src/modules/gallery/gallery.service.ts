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
  const { search, businessDomain, projectType, level, tool, sort, page, limit } = query;

  // Un projet ne peut jamais être plus visible ici que dans son propre
  // portfolio : même filtre que la page de détail projet (public.service.ts)
  // pour ne jamais lister un projet dont le lien mènerait à un 404.
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
      // user.slug est non-null ici : le filtre where garantit
      // user.portfolioPublished === true, ce qui n'est jamais vrai sans slug
      // (voir setPortfolioPublished dans users.service.ts).
      return { ...project, owner: user as GalleryProjectOwner };
    }),
    total,
    page,
    limit,
  };
}