import { User } from '@prisma/client';

/** Strict whitelist for the public portfolio page — never derived from
 * PublicUser (users.service.ts), which still carries the login email,
 * role, and isEmailVerified. Nothing here should ever leak account data. */
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
  availability: string;
  services: string[];
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  publicContactEmail: string | null;
}

export function serializePublicProfile(user: User): PublicProfile {
  return {
    slug: user.slug!, // safe: caller only invokes this on a published (slug-having) user
    firstName: user.firstName,
    lastName: user.lastName,
    professionalTitle: user.professionalTitle,
    bio: user.bio,
    profilePhotoUrl: user.profilePhotoUrl,
    country: user.country,
    city: user.city,
    languages: user.languages,
    skills: user.skills,
    availability: user.availability,
    services: user.services,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    websiteUrl: user.websiteUrl,
    publicContactEmail: user.publicContactEmail,
  };
}