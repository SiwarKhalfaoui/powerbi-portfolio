import { Link } from 'react-router-dom';
import { Eye, ImageOff, Pencil, Trash2 } from 'lucide-react';
import { Project, PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from '../../types';

const STATUS_BADGE_CLASSES: Record<Project['status'], string> = {
  DRAFT: 'bg-mist-100 text-mist-700',
  PUBLISHED: 'bg-teal/10 text-teal-700',
  PRIVATE: 'bg-violet/10 text-violet-600',
  ARCHIVED: 'bg-mist-100 text-mist-400',
};

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold text-mist-900">{project.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE_CLASSES[project.status]}`}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
        </div>

        <p className="mt-1 text-xs text-mist-700">{PROJECT_TYPE_LABELS[project.projectType]}</p>

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

        <div className="mt-4 flex items-center justify-between border-t border-mist-200 pt-3">
          <span className="flex items-center gap-1 text-xs text-mist-400">
            <Eye className="h-3.5 w-3.5" />
            {project.viewCount}
          </span>
          <div className="flex items-center gap-1">
            <Link
              to={`/dashboard/projects/${project.id}/edit`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-mist-100"
              aria-label="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDelete(project)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-danger-50 hover:text-danger"
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}