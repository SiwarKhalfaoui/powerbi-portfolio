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

// doc Module 6 — "tri par nombre de vues". Dédupliqué par visiteur sur une
// fenêtre glissante de 24h (compte connecté, ou identifiant anonyme
// généré côté navigateur) — le même compromis que la plupart des
// plateformes de contenu public : un F5 ne gonfle pas le compteur, mais
// une vraie visite le lendemain recompte, pour que le tri par popularité
// reste un signal vivant sur la durée plutôt que figé après une semaine.
const VIEW_DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

async function registerViewIfNew(projectId: string, visitorKey: string | null): Promise<void> {
  if (!visitorKey) {
    // Aucun identifiant exploitable (ni compte, ni identifiant anonyme
    // transmis) — cas rare (appel API direct hors de notre frontend). On
    // compte quand même la vue plutôt que de la perdre silencieusement,
    // sans déduplication possible dans ce cas précis.
    await prisma.project.update({
      where: { id: projectId },
      data: { viewCount: { increment: 1 } },
    });
    return;
  }

  const since = new Date(Date.now() - VIEW_DEDUP_WINDOW_MS);
  const recentView = await prisma.projectView.findFirst({
    where: { projectId, visitorKey, viewedAt: { gte: since } },
  });
  if (recentView) {
    return;
  }

  await prisma.$transaction([
    prisma.projectView.create({ data: { projectId, visitorKey } }),
    prisma.project.update({ where: { id: projectId }, data: { viewCount: { increment: 1 } } }),
  ]);
}

/** doc Module 3/5 — page de détail projet. A project must still be
 * PUBLISHED regardless of who's asking — preview only bypasses the
 * portfolio-level publish toggle, never a project's own draft status, so a
 * preview always shows exactly what publishing would make visible. */
export async function getPublicProjectBySlug(
  userSlug: string,
  projectSlug: string,
  viewerId?: string,
  anonVisitorId?: string,
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

  if (!isOwner) {
    const visitorKey = viewerId
      ? `user:${viewerId}`
      : anonVisitorId
        ? `anon:${anonVisitorId}`
        : null;
    await registerViewIfNew(project.id, visitorKey);
  }

  // Re-lit le projet après un éventuel incrément, pour renvoyer un
  // viewCount à jour à l'appelant — inutile si owner (rien n'a changé).
  const finalProject = isOwner
    ? project
    : await prisma.project.findUniqueOrThrow({ where: { id: project.id } });

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