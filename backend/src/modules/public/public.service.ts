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
        orderBy: { order: 'asc' },
      },
    },
  });

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

export interface PublicProjectOwner {
  slug: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
}

export interface PublicProjectDetail {
  project: Project;
  owner: PublicProjectOwner;
}


export async function getPublicProjectBySlug(
  userSlug: string,
  projectSlug: string,
): Promise<PublicProjectDetail> {
  const user = await prisma.user.findUnique({ where: { slug: userSlug } });
  if (!user || !user.portfolioPublished) {
    throw ApiError.notFound('Project not found');
  }

  const project = await prisma.project.findUnique({ where: { slug: projectSlug } });
  if (!project || project.userId !== user.id || project.status !== ProjectStatus.PUBLISHED) {
    throw ApiError.notFound('Project not found');
  }

  const updated = await prisma.project.update({
    where: { id: project.id },
    data: { viewCount: { increment: 1 } },
  });

  return {
    project: updated,
    owner: {
      slug: user.slug!,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
    },
  };
}