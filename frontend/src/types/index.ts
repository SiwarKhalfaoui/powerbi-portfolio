export type Availability = 'FREELANCE' | 'CDI' | 'STAGE' | 'CONSULTANT' | 'NOT_SPECIFIED';
export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  bio: string | null;
  profilePhotoUrl: string | null;
  country: string | null;
  city: string | null;
  languages: string[];
  skills: string[];
  availability: Availability;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  role: Role;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  details?: unknown;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  FREELANCE: 'Freelance',
  CDI: 'CDI',
  STAGE: 'Stage',
  CONSULTANT: 'Consultant',
  NOT_SPECIFIED: 'Non précisé',
};

export type ProjectType = 'DASHBOARD' | 'REPORT' | 'ANALYSIS' | 'TEMPLATE' | 'CASE_STUDY';
export type ProjectLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'ARCHIVED';

export interface Project {
  id: string;
  userId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  businessDomain: string | null;
  projectType: ProjectType;
  toolsUsed: string[];
  level: ProjectLevel;
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  interactiveLink: string | null;
  ownershipConfirmed: boolean;
  videoUrl: string | null;
  datasetUrl: string | null;
  results: string | null;
  tags: string[];
  status: ProjectStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  DASHBOARD: 'Dashboard',
  REPORT: 'Rapport',
  ANALYSIS: 'Analyse',
  TEMPLATE: 'Template',
  CASE_STUDY: 'Étude de cas',
};

export const PROJECT_LEVEL_LABELS: Record<ProjectLevel, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  PRIVATE: 'Privé',
  ARCHIVED: 'Archivé',
};