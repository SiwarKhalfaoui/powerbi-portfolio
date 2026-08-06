import { api } from '../../lib/axios';
import { ApiEnvelope, Project } from '../../types';

export interface ProjectFormPayload {
  title: string;
  shortDescription: string;
  description: string;
  businessDomain: string;
  projectType: Project['projectType'];
  toolsUsed: string[];
  level: Project['level'];
  coverImageUrl: string;
  galleryImageUrls: string[];
  interactiveLink: string;
  ownershipConfirmed: boolean;
  videoUrl: string;
  datasetUrl: string;
  results: string;
  tags: string[];
  status: Project['status'];
  isFeatured: boolean;
}

export async function listMyProjectsRequest() {
  const { data } = await api.get<ApiEnvelope<{ projects: Project[] }>>('/projects/me');
  return data.data.projects;
}

export async function getProjectRequest(id: string) {
  const { data } = await api.get<ApiEnvelope<{ project: Project }>>(`/projects/${id}`);
  return data.data.project;
}

export async function createProjectRequest(payload: ProjectFormPayload) {
  const { data } = await api.post<ApiEnvelope<{ project: Project }>>('/projects', payload);
  return data.data.project;
}

export async function updateProjectRequest(id: string, payload: Partial<ProjectFormPayload>) {
  const { data } = await api.patch<ApiEnvelope<{ project: Project }>>(`/projects/${id}`, payload);
  return data.data.project;
}

export async function deleteProjectRequest(id: string) {
  await api.delete(`/projects/${id}`);
}

export async function uploadProjectImageRequest(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post<ApiEnvelope<{ url: string }>>(
    '/projects/upload-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data.url;
}

export async function reorderProjectsRequest(orderedIds: string[]): Promise<void> {
  await api.patch('/projects/reorder', { orderedIds });
}