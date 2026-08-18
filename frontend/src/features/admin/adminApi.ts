import { api } from '../../lib/axios';
import {
  ApiEnvelope,
  AdminStats,
  AdminUsersResult,
  AdminUserItem,
  AdminProjectsResult,
  AdminProjectItem,
  ProjectStatus,
  Role,
} from '../../types';

export async function fetchAdminStats() {
  const { data } = await api.get<ApiEnvelope<{ stats: AdminStats }>>('/admin/stats');
  return data.data.stats;
}

export async function fetchAdminUsers(params: { search?: string; page?: number; limit?: number }) {
  const { data } = await api.get<ApiEnvelope<AdminUsersResult>>('/admin/users', { params });
  return data.data;
}

export async function setUserSuspended(id: string, isSuspended: boolean) {
  const { data } = await api.patch<ApiEnvelope<{ user: AdminUserItem }>>(`/admin/users/${id}/status`, {
    isSuspended,
  });
  return data.data.user;
}

export async function setUserRole(id: string, role: Role) {
  const { data } = await api.patch<ApiEnvelope<{ user: AdminUserItem }>>(`/admin/users/${id}/role`, {
    role,
  });
  return data.data.user;
}

export async function deleteUser(id: string) {
  await api.delete(`/admin/users/${id}`);
}

export async function fetchAdminProjects(params: {
  search?: string;
  status?: ProjectStatus;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get<ApiEnvelope<AdminProjectsResult>>('/admin/projects', { params });
  return data.data;
}

export async function setProjectStatusAdmin(id: string, status: ProjectStatus) {
  const { data } = await api.patch<ApiEnvelope<{ project: AdminProjectItem }>>(
    `/admin/projects/${id}/status`,
    { status },
  );
  return data.data.project;
}