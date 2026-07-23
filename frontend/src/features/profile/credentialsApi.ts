import { api } from '../../lib/axios';
import { ApiEnvelope, Experience, Formation, Certification } from '../../types';

export interface ExperiencePayload {
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
}

export interface FormationPayload {
  degree: string;
  institution: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
}

export interface CertificationPayload {
  name: string;
  issuer: string;
  issueDate: string | null;
  credentialUrl: string;
}

// ── Experiences ──────────────────────────────────────────────────────────

export async function listExperiencesRequest() {
  const { data } = await api.get<ApiEnvelope<{ experiences: Experience[] }>>('/users/me/experiences');
  return data.data.experiences;
}
export async function createExperienceRequest(payload: ExperiencePayload) {
  const { data } = await api.post<ApiEnvelope<{ experience: Experience }>>('/users/me/experiences', payload);
  return data.data.experience;
}
export async function updateExperienceRequest(id: string, payload: ExperiencePayload) {
  const { data } = await api.patch<ApiEnvelope<{ experience: Experience }>>(`/users/me/experiences/${id}`, payload);
  return data.data.experience;
}
export async function deleteExperienceRequest(id: string) {
  await api.delete(`/users/me/experiences/${id}`);
}

// ── Formations ───────────────────────────────────────────────────────────

export async function listFormationsRequest() {
  const { data } = await api.get<ApiEnvelope<{ formations: Formation[] }>>('/users/me/formations');
  return data.data.formations;
}
export async function createFormationRequest(payload: FormationPayload) {
  const { data } = await api.post<ApiEnvelope<{ formation: Formation }>>('/users/me/formations', payload);
  return data.data.formation;
}
export async function updateFormationRequest(id: string, payload: FormationPayload) {
  const { data } = await api.patch<ApiEnvelope<{ formation: Formation }>>(`/users/me/formations/${id}`, payload);
  return data.data.formation;
}
export async function deleteFormationRequest(id: string) {
  await api.delete(`/users/me/formations/${id}`);
}

// ── Certifications ───────────────────────────────────────────────────────

export async function listCertificationsRequest() {
  const { data } = await api.get<ApiEnvelope<{ certifications: Certification[] }>>('/users/me/certifications');
  return data.data.certifications;
}
export async function createCertificationRequest(payload: CertificationPayload) {
  const { data } = await api.post<ApiEnvelope<{ certification: Certification }>>('/users/me/certifications', payload);
  return data.data.certification;
}
export async function updateCertificationRequest(id: string, payload: CertificationPayload) {
  const { data } = await api.patch<ApiEnvelope<{ certification: Certification }>>(
    `/users/me/certifications/${id}`,
    payload,
  );
  return data.data.certification;
}
export async function deleteCertificationRequest(id: string) {
  await api.delete(`/users/me/certifications/${id}`);
}