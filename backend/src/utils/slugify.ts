import { prisma } from '../config/prisma';

/** Converts "Ventes Retail 2024 !" into "ventes-retail-2024". */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Generates a URL-safe slug for a project title, appending a short random
 * suffix if the base slug is already taken. Project slugs are globally
 * unique (not just per-user) since they'll back public project URLs.
 */
export async function generateUniqueProjectSlug(title: string): Promise<string> {
  const base = slugify(title) || 'projet';

  const existing = await prisma.project.findUnique({ where: { slug: base } });
  if (!existing) return base;

  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

/**
 * Generates a URL-safe slug for a user's public portfolio, from their name.
 * Called once, the first time the portfolio is published — never
 * regenerated afterwards even if the user edits their name later, so a
 * shared public URL never breaks. Mirrors generateUniqueProjectSlug.
 */
export async function generateUniqueUserSlug(firstName: string, lastName: string): Promise<string> {
  const base = slugify(`${firstName} ${lastName}`) || 'user';

  const existing = await prisma.user.findUnique({ where: { slug: base } });
  if (!existing) return base;

  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}