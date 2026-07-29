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
  // doc Module 3 — "prévisualiser le portfolio avant publication". True
  // only when the viewer is the owner AND the portfolio isn't actually
  // published yet — lets the frontend show a "preview, not live" banner.
  isPreview: boolean;
}

export async function getPublicPortfolioBySlug(
  slug: string,
  viewerId?: string,
): Promise<PublicPortfolio> {
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

  const isOwner = Boolean(user && viewerId && viewerId === user.id);

  // Same 404-not-403 philosophy as everywhere else — except for the owner
  // previewing their own unpublished portfolio, who must see it.
  if (!user || (!user.portfolioPublished && !isOwner)) {
    throw ApiError.notFound('Portfolio not found');
  }

  return {
    profile: serializePublicProfile(user),
    experiences: user.experiences,
    formations: user.formations,
    certifications: user.certifications,
    projects: user.projects,
    isPreview: isOwner && !user.portfolioPublished,
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
  isPreview: boolean;
}

/** doc Module 3/5 — page de détail projet. A project must still be
 * PUBLISHED regardless of who's asking — preview only bypasses the
 * portfolio-level publish toggle, never a project's own draft status, so a
 * preview always shows exactly what publishing would make visible. */
export async function getPublicProjectBySlug(
  userSlug: string,
  projectSlug: string,
  viewerId?: string,
): Promise<PublicProjectDetail> {
  const user = await prisma.user.findUnique({ where: { slug: userSlug } });
  const isOwner = Boolean(user && viewerId && viewerId === user.id);

  if (!user || (!user.portfolioPublished && !isOwner)) {
    throw ApiError.notFound('Project not found');
  }

  const project = await prisma.project.findUnique({ where: { slug: projectSlug } });
  if (!project || project.userId !== user.id || project.status !== ProjectStatus.PUBLISHED) {
    throw ApiError.notFound('Project not found');
  }

  // Don't inflate view counts when the owner is checking their own preview.
  const finalProject = isOwner
    ? project
    : await prisma.project.update({
        where: { id: project.id },
        data: { viewCount: { increment: 1 } },
      });

  return {
    project: finalProject,
    owner: {
      slug: user.slug!,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
    },
    isPreview: isOwner && !user.portfolioPublished,
  };
}