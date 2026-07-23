import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Mail, Linkedin, Github, Globe, MapPin, Loader2 } from 'lucide-react';
import { fetchPublicPortfolio } from '../features/public/publicApi';
import { AVAILABILITY_LABELS } from '../types';
import { PublicProjectCard } from '../features/public/PublicProjectCard';

export function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-portfolio', slug],
    queryFn: () => fetchPublicPortfolio(slug as string),
    enabled: Boolean(slug),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist-50">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-mist-50 px-4 text-center">
        <h1 className="font-display text-xl font-semibold text-mist-900">Portfolio introuvable</h1>
        <p className="text-sm text-mist-700">Ce portfolio n'existe pas ou n'a pas encore été publié.</p>
        <Link to="/" className="mt-2 text-sm font-medium text-teal-600 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const { profile, experiences, formations, certifications, projects } = data;

  return (
    <div className="min-h-screen bg-mist-50">
      <header className="border-b border-mist-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-12 text-center">
          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={profile.firstName + ' ' + profile.lastName}
              className="h-24 w-24 rounded-full object-cover shadow-card"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-violet-gradient font-display text-2xl font-semibold text-white">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </div>
          )}

          <div>
            <h1 className="font-display text-2xl font-semibold text-mist-900">
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.professionalTitle && (
              <p className="mt-1 text-sm font-medium text-teal-700">{profile.professionalTitle}</p>
            )}
            {(profile.city || profile.country) && (
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-mist-400">
                <MapPin className="h-3.5 w-3.5" />
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          {profile.bio && <p className="max-w-xl text-sm text-mist-700">{profile.bio}</p>}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-mist-100 px-3 py-1 text-xs font-medium text-mist-700">
              {AVAILABILITY_LABELS[profile.availability]}
            </span>

            {profile.publicContactEmail && (
              <a
                href={'mailto:' + profile.publicContactEmail}
                className="flex items-center gap-1 rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal-700 hover:bg-teal/20"
              >
                <Mail className="h-3.5 w-3.5" />
                Contact
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-full bg-mist-100 px-3 py-1 text-xs font-medium text-mist-700 hover:bg-mist-200"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            )}

            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-full bg-mist-100 px-3 py-1 text-xs font-medium text-mist-700 hover:bg-mist-200"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}

            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-full bg-mist-100 px-3 py-1 text-xs font-medium text-mist-700 hover:bg-mist-200"
              >
                <Globe className="h-3.5 w-3.5" />
                Site web
              </a>
            )}
          </div>

          {profile.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-mist-200 px-2.5 py-1 text-[11px] font-medium text-mist-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <section>
          <h2 className="font-display text-lg font-semibold text-mist-900">Projets</h2>
          {projects.length === 0 ? (
            <p className="mt-3 text-sm text-mist-700">Aucun projet publié pour le moment.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <PublicProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>

        {experiences.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-mist-900">Expériences</h2>
            <div className="mt-4 space-y-4">
              {experiences.map((experience) => (
                <div key={experience.id} className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
                  <p className="font-display text-sm font-semibold text-mist-900">{experience.title}</p>
                  <p className="text-xs text-mist-700">{experience.company}</p>
                  {experience.description && (
                    <p className="mt-2 text-sm text-mist-700">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {formations.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-mist-900">Formations</h2>
            <div className="mt-4 space-y-4">
              {formations.map((formation) => (
                <div key={formation.id} className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
                  <p className="font-display text-sm font-semibold text-mist-900">{formation.degree}</p>
                  <p className="text-xs text-mist-700">{formation.institution}</p>
                  {formation.description && (
                    <p className="mt-2 text-sm text-mist-700">{formation.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-mist-900">Certifications</h2>
            <div className="mt-4 space-y-4">
              {certifications.map((certification) => (
                <div key={certification.id} className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
                  <p className="font-display text-sm font-semibold text-mist-900">{certification.name}</p>
                  <p className="text-xs text-mist-700">{certification.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.services.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-mist-900">Services proposés</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.services.map((service) => (
                <span key={service} className="rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber-600">
                  {service}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}