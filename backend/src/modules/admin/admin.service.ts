import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { Prisma, ProjectStatus, Role } from '@prisma/client';
import { AdminListUsersQuery, AdminListProjectsQuery } from './admin.validation';

/**
 * KPIs from the "Dashboard administrateur" (Module 10) that are actually
 * derivable from what's implemented: no comments/reports/premium exist,
 * so those KPIs are intentionally omitted rather than faked.
 */
export async function getStats() {
  const [totalUsers, publishedPortfolios, totalProjects, publishedProjects, interactiveProjects, viewsAgg] =
    await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { portfolioPublished: true } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: ProjectStatus.PUBLISHED } }),
      prisma.project.count({ where: { interactiveLink: { not: null } } }),
      prisma.project.aggregate({ _sum: { viewCount: true } }),
    ]);

  const topProjects = await prisma.project.findMany({
    where: { status: ProjectStatus.PUBLISHED },
    orderBy: { viewCount: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      viewCount: true,
      user: { select: { firstName: true, lastName: true, slug: true } },
    },
  });

  return {
    totalUsers,
    publishedPortfolios,
    totalProjects,
    publishedProjects,
    interactiveProjects,
    totalViews: viewsAgg._sum.viewCount ?? 0,
    topProjects: topProjects.map((p) => {
      const { user, ...project } = p;
      return { ...project, owner: user };
    }),
  };
}

export async function listUsers(query: AdminListUsersQuery) {
  const { search, page, limit } = query;

  const where: Prisma.UserWhereInput = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        portfolioPublished: true,
        isSuspended: true,
        slug: true,
        createdAt: true,
        _count: { select: { projects: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit };
}

export async function setUserSuspended(id: string, isSuspended: boolean, actingAdminId: string) {
  if (id === actingAdminId) {
    throw ApiError.badRequest("You can't suspend your own account");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  if (user.role === Role.ADMIN) {
    throw ApiError.badRequest("You can't suspend another admin account");
  }

  const updated = await prisma.user.update({ where: { id }, data: { isSuspended } });
  const { passwordHash: _passwordHash, ...safeUser } = updated;
  return safeUser;
}

export async function setUserRole(id: string, role: Role, actingAdminId: string) {
  if (id === actingAdminId) {
    throw ApiError.badRequest("You can't change your own role");
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const updated = await prisma.user.update({ where: { id }, data: { role } });
  const { passwordHash: _passwordHash, ...safeUser } = updated;
  return safeUser;
}

export async function deleteUser(id: string, actingAdminId: string) {
  if (id === actingAdminId) {
    throw ApiError.badRequest("You can't delete your own account");
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  if (user.role === Role.ADMIN) {
    throw ApiError.badRequest('Demote this account to USER before deleting it');
  }

  // Cascades in schema.prisma (onDelete: Cascade) remove the user's
  // projects, refresh tokens, experiences, etc. Uploaded image files on
  // disk are NOT cleaned up here — known gap, see passation notes.
  await prisma.user.delete({ where: { id } });
}

export async function listAllProjects(query: AdminListProjectsQuery) {
  const { search, status, page, limit } = query;

  const where: Prisma.ProjectWhereInput = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, slug: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects: projects.map((p) => {
      const { user, ...project } = p;
      return { ...project, owner: user };
    }),
    total,
    page,
    limit,
  };
}

/** Admin override: force a project's status (e.g. dépublier un contenu problématique) regardless of ownership. */
export async function setProjectStatus(id: string, status: ProjectStatus) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw ApiError.notFound('Project not found');
  }
  return prisma.project.update({ where: { id }, data: { status } });
}