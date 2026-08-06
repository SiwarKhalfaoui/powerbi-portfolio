import { Link } from 'react-router-dom';
import { ImageOff, ExternalLink, Star } from 'lucide-react';
import { Project, PROJECT_TYPE_LABELS, BUSINESS_DOMAIN_LABELS } from '../../types';

interface PublicProjectCardProps {
  project: Project;
  ownerSlug: string;
}

export function PublicProjectCard({ project, ownerSlug }: PublicProjectCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
      <Link to={`/${ownerSlug}/${project.slug}`} className="block">
        <div className="relative flex h-36 items-center justify-center bg-mist-100">
          {project.coverImageUrl ? (
            <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <ImageOff className="h-8 w-8 text-mist-400" />
          )}
          {project.isFeatured && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber px-2 py-0.5 text-[11px] font-medium text-ink-950">
              <Star className="h-3 w-3 fill-current" />
              Mis en avant
            </span>
          )}
        </div>

        <div className="p-4 pb-0">
          <h3 className="font-display text-sm font-semibold text-mist-900 hover:text-teal-700">
            {project.title}
          </h3>

          <p className="mt-1 text-xs text-mist-700">
            {PROJECT_TYPE_LABELS[project.projectType]}
            {project.businessDomain ? ' · ' + BUSINESS_DOMAIN_LABELS[project.businessDomain] : ''}
          </p>

          {project.shortDescription && (
            <p className="mt-2 line-clamp-2 text-sm text-mist-700">{project.shortDescription}</p>
          )}

          {project.toolsUsed.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.toolsUsed.slice(0, 4).map((tool) => (
                <span key={tool} className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] font-medium text-mist-700">
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 pt-3">
        {project.interactiveLink && (
          <a
            href={project.interactiveLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-mist-200 py-2 text-xs font-medium text-teal-700 hover:bg-mist-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir le rapport interactif
          </a>
        )}
      </div>
    </div>
  );
}