import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Loader2, ImageOff } from 'lucide-react';
import { fetchPublicProject } from '../features/public/publicApi';
import { PROJECT_TYPE_LABELS, PROJECT_LEVEL_LABELS, BUSINESS_DOMAIN_LABELS } from '../types';

export function PublicProjectDetailPage() {
  const { slug, projectSlug } = useParams<{ slug: string; projectSlug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-project', slug, projectSlug],
    queryFn: () => fetchPublicProject(slug as string, projectSlug as string),
    enabled: Boolean(slug) && Boolean(projectSlug),
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
        <h1 className="font-display text-xl font-semibold text-mist-900">Projet introuvable</h1>
        <p className="text-sm text-mist-700">Ce projet n'existe pas ou n'est plus disponible.</p>
        <Link to="/" className="mt-2 text-sm font-medium text-teal-600 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const { project, owner } = data;

  return (
    <div className="min-h-screen bg-mist-50">
      <header className="border-b border-mist-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link
            to={`/${owner.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mist-700 hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {owner.firstName} {owner.lastName}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-700">
            {PROJECT_TYPE_LABELS[project.projectType]}
          </span>
          {project.businessDomain && (
            <span className="rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-700">
              {BUSINESS_DOMAIN_LABELS[project.businessDomain]}
            </span>
          )}
          <span className="rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-700">
            {PROJECT_LEVEL_LABELS[project.level]}
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-semibold text-mist-900">{project.title}</h1>
        {project.shortDescription && (
          <p className="mt-2 text-sm text-mist-700">{project.shortDescription}</p>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          {project.coverImageUrl ? (
            <img src={project.coverImageUrl} alt={project.title} className="w-full object-cover" />
          ) : (
            <div className="flex h-56 items-center justify-center bg-mist-100">
              <ImageOff className="h-10 w-10 text-mist-400" />
            </div>
          )}
        </div>

        {project.galleryImageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {project.galleryImageUrls.map((url) => (
              <img key={url} src={url} alt={project.title} className="aspect-video w-full rounded-xl object-cover" />
            ))}
          </div>
        )}

        {project.description && (
          <section className="mt-8">
            <h2 className="font-display text-base font-semibold text-mist-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-mist-700">{project.description}</p>
          </section>
        )}

        {project.toolsUsed.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-base font-semibold text-mist-900">Outils utilisés</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.toolsUsed.map((tool) => (
                <span key={tool} className="rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-700">
                  {tool}
                </span>
              ))}
            </div>
          </section>
        )}

        {project.results && (
          <section className="mt-6">
            <h2 className="font-display text-base font-semibold text-mist-900">Résultats</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-mist-700">{project.results}</p>
          </section>
        )}

        {project.interactiveLink && (
          <section className="mt-8">
            <h2 className="font-display text-base font-semibold text-mist-900">Rapport interactif</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-mist-200 shadow-card">
              <iframe
                src={project.interactiveLink}
                title={project.title}
                className="h-[480px] w-full"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
            <a
              href={project.interactiveLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ouvrir dans un nouvel onglet
            </a>
          </section>
        )}

        {project.videoUrl && (
          <section className="mt-8">
            <h2 className="font-display text-base font-semibold text-mist-900">Vidéo de démonstration</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-mist-200 shadow-card">
              <iframe
                src={project.videoUrl}
                title={project.title + ' - vidéo'}
                className="aspect-video w-full"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {project.datasetUrl && (
          <section className="mt-8">
            <h2 className="font-display text-base font-semibold text-mist-900">Source des données</h2>
            <a
              href={project.datasetUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Accéder au dataset
            </a>
          </section>
        )}

        {project.tags.length > 0 && (
          <section className="mt-8 border-t border-mist-200 pt-6">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-mist-200 px-2.5 py-1 text-[11px] font-medium text-mist-700">
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}