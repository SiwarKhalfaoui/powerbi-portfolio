import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { serializePublicProfile, PublicProfile } from '../../utils/serializePublicProfile';
import { Experience, Formation, Certification, Project, ProjectStatus } from '@prisma/client';

export interface PublicPortfolio {
  profile: PublicProfile;
  experiences: Experience[];
  formations: Formation[];
  certifications: Certification[];
  projects: Project[];
}

export async function getPublicPortfolioBySlug(slug: string): Promise<PublicPortfolio> {
  const user = await prisma.user.findUnique({
    where: { slug },
    include: {
      experiences: { orderBy: { startDate: 'desc' } },
      formations: { orderBy: { startDate: 'desc' } },
      certifications: { orderBy: { issueDate: 'desc' } },
      projects: {
        where: { status: ProjectStatus.PUBLISHED },
        // doc Module 3 — "définir l'ordre des projets".
        orderBy: { order: 'asc' },
      },
    },
  });

  // Same 404-not-403 philosophy as project ownership checks: a slug that
  // exists but belongs to an unpublished portfolio must look identical to
  // a slug that doesn't exist at all.
  if (!user || !user.portfolioPublished) {
    throw ApiError.notFound('Portfolio not found');
  }

  return {
    profile: serializePublicProfile(user),
    experiences: user.experiences,
    formations: user.formations,
    certifications: user.certifications,
    projects: user.projects,
  };
}