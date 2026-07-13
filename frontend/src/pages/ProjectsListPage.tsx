import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, FolderKanban, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProjectCard } from '../features/projects/ProjectCard';
import { listMyProjectsRequest, deleteProjectRequest } from '../features/projects/projectsApi';
import { getErrorMessage } from '../lib/errors';
import { Project } from '../types';

export function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listMyProjectsRequest()
      .then(setProjects)
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger vos projets.')));
  }, []);

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(`Supprimer « ${project.title} » ? Cette action est irréversible.`);
    if (!confirmed) return;

    setDeletingId(project.id);
    try {
      await deleteProjectRequest(project.id);
      setProjects((prev) => prev?.filter((p) => p.id !== project.id) ?? null);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de supprimer ce projet.'));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-teal-700">
            Portfolio
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-mist-900">Mes projets</h1>
        </div>
        <Link to="/dashboard/projects/new">
          <Button variant="accent">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {projects === null && !error && (
        <p className="text-sm text-mist-700">Chargement de vos projets...</p>
      )}

      {projects && projects.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <FolderKanban className="h-8 w-8 text-mist-400" />
          <p className="font-display text-base font-semibold text-mist-900">
            Aucun projet pour le moment
          </p>
          <p className="max-w-sm text-sm text-mist-700">
            Ajoutez votre premier dashboard Power BI pour commencer à construire votre portfolio.
          </p>
          <Link to="/dashboard/projects/new">
            <Button variant="accent" size="sm">
              <Plus className="h-4 w-4" />
              Créer un projet
            </Button>
          </Link>
        </Card>
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className={deletingId === project.id ? 'pointer-events-none opacity-50' : ''}>
              <ProjectCard project={project} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}