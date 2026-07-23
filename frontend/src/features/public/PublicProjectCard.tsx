import { ImageOff, ExternalLink } from 'lucide-react';
import { Project, PROJECT_TYPE_LABELS, BUSINESS_DOMAIN_LABELS } from '../../types';

interface PublicProjectCardProps {
  project: Project;
}

export function PublicProjectCard({ project }: PublicProjectCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
      <div className="flex h-36 items-center justify-center bg-mist-100">
        {project.coverImageUrl ? (
          <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="h-8 w-8 text-mist-400" />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-sm font-semibold text-mist-900">{project.title}</h3>

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

        {project.interactiveLink && (
          <a
            href={project.interactiveLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-mist-200 py-2 text-xs font-medium text-teal-700 hover:bg-mist-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir le rapport interactif
          </a>
        )}
      </div>
    </div>
  );
}