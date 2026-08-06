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
  services: string[];
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  publicContactEmail: string | null;
  slug: string | null;
  portfolioPublished: boolean;
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

export interface Experience {
  id: string;
  userId: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Formation {
  id: string;
  userId: string;
  degree: string;
  institution: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  userId: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  credentialUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProjectType = 'DASHBOARD' | 'REPORT' | 'ANALYSIS' | 'TEMPLATE' | 'CASE_STUDY';
export type ProjectLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'ARCHIVED';

export type BusinessDomain =
  | 'FINANCE'
  | 'COMMERCIAL'
  | 'HR'
  | 'MARKETING'
  | 'SUPPLY_CHAIN'
  | 'LOGISTICS'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'REAL_ESTATE'
  | 'PRODUCTION'
  | 'ECOMMERCE'
  | 'ESG'
  | 'DATA_ENGINEERING'
  | 'MICROSOFT_FABRIC'
  | 'ARTIFICIAL_INTELLIGENCE'
  | 'OTHER';

export const BUSINESS_DOMAIN_LABELS: Record<BusinessDomain, string> = {
  FINANCE: 'Finance',
  COMMERCIAL: 'Commercial',
  HR: 'Ressources humaines',
  MARKETING: 'Marketing',
  SUPPLY_CHAIN: 'Supply Chain',
  LOGISTICS: 'Logistique',
  HEALTHCARE: 'Santé',
  EDUCATION: 'Éducation',
  REAL_ESTATE: 'Immobilier',
  PRODUCTION: 'Production',
  ECOMMERCE: 'E-commerce',
  ESG: 'ESG',
  DATA_ENGINEERING: 'Data Engineering',
  MICROSOFT_FABRIC: 'Microsoft Fabric',
  ARTIFICIAL_INTELLIGENCE: 'Intelligence Artificielle',
  OTHER: 'Autre',
};

export interface Project {
  id: string;
  userId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  businessDomain: BusinessDomain | null;
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
  order: number;
  // doc Module 3 — "mettre en avant certains projets".
  isFeatured: boolean;
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

export interface PublicProfile {
  slug: string;
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
  services: string[];
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  publicContactEmail: string | null;
}

export interface PublicPortfolio {
  profile: PublicProfile;
  experiences: Experience[];
  formations: Formation[];
  certifications: Certification[];
  projects: Project[];
  isPreview: boolean;
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

export interface GalleryProjectOwner {
  slug: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
}

export interface GalleryProjectItem extends Project {
  owner: GalleryProjectOwner;
}

export type GallerySort = 'recent' | 'popular';

export interface GalleryFilters {
  search?: string;
  businessDomain?: BusinessDomain;
  projectType?: ProjectType;
  level?: ProjectLevel;
  tool?: string;
  tag?: string;
  sort?: GallerySort;
  page?: number;
}

export interface GalleryResult {
  projects: GalleryProjectItem[];
  total: number;
  page: number;
  limit: number;
}