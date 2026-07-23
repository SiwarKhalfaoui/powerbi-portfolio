import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/ApiError';
import { ExperienceInput, FormationInput, CertificationInput } from './credentials.validation';

/** Empty-string optional fields (from a cleared form input) should clear the column, not write "". */
function nullifyEmptyStrings<T extends Record<string, unknown>>(input: T): T {
  const result = { ...input };
  for (const key of Object.keys(result)) {
    if (result[key] === '') {
      (result as Record<string, unknown>)[key] = null;
    }
  }
  return result;
}

// ── Experiences ──────────────────────────────────────────────────────────

export async function listExperiences(userId: string) {
  return prisma.experience.findMany({ where: { userId }, orderBy: { startDate: 'desc' } });
}

export async function createExperience(userId: string, input: ExperienceInput) {
  return prisma.experience.create({ data: { ...nullifyEmptyStrings(input), userId } });
}

export async function updateExperience(id: string, userId: string, input: ExperienceInput) {
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) throw ApiError.notFound('Experience not found');
  return prisma.experience.update({ where: { id }, data: nullifyEmptyStrings(input) });
}

export async function deleteExperience(id: string, userId: string) {
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) throw ApiError.notFound('Experience not found');
  await prisma.experience.delete({ where: { id } });
}

// ── Formations ───────────────────────────────────────────────────────────

export async function listFormations(userId: string) {
  return prisma.formation.findMany({ where: { userId }, orderBy: { startDate: 'desc' } });
}

export async function createFormation(userId: string, input: FormationInput) {
  return prisma.formation.create({ data: { ...nullifyEmptyStrings(input), userId } });
}

export async function updateFormation(id: string, userId: string, input: FormationInput) {
  const existing = await prisma.formation.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) throw ApiError.notFound('Formation not found');
  return prisma.formation.update({ where: { id }, data: nullifyEmptyStrings(input) });
}

export async function deleteFormation(id: string, userId: string) {
  const existing = await prisma.formation.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) throw ApiError.notFound('Formation not found');
  await prisma.formation.delete({ where: { id } });
}

// ── Certifications ───────────────────────────────────────────────────────

export async function listCertifications(userId: string) {
  return prisma.certification.findMany({ where: { userId }, orderBy: { issueDate: 'desc' } });
}

export async function createCertification(userId: string, input: CertificationInput) {
  return prisma.certification.create({ data: { ...nullifyEmptyStrings(input), userId } });
}

export async function updateCertification(id: string, userId: string, input: CertificationInput) {
  const existing = await prisma.certification.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) throw ApiError.notFound('Certification not found');
  return prisma.certification.update({ where: { id }, data: nullifyEmptyStrings(input) });
}

export async function deleteCertification(id: string, userId: string) {
  const existing = await prisma.certification.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) throw ApiError.notFound('Certification not found');
  await prisma.certification.delete({ where: { id } });
}