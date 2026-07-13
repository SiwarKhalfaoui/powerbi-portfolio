import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProjectForm } from '../features/projects/ProjectForm';
import {
  getProjectRequest,
  updateProjectRequest,
  deleteProjectRequest,
  ProjectFormPayload,
} from '../features/projects/projectsApi';
import { getErrorMessage } from '../lib/errors';
import { Project } from '../types';

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getProjectRequest(id)
      .then(setProject)
      .catch((err) => setLoadError(getErrorMessage(err, 'Projet introuvable.')));
  }, [id]);

  async function handleSubmit(payload: ProjectFormPayload) {
    if (!id) return;
    const updated = await updateProjectRequest(id, payload);
    setProject(updated);
  }

  async function handleDelete() {
    if (!id || !project) return;
    const confirmed = window.confirm(`Supprimer « ${project.title} » ? Cette action est irréversible.`);
    if (!confirmed) return;
    await deleteProjectRequest(id);
    navigate('/dashboard/projects', { replace: true });
  }

  if (loadError) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{loadError}</span>
        </div>
        <Link to="/dashboard/projects" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Retour à mes projets
        </Link>
      </div>
    );
  }

  if (!project) {
    return <p className="text-sm text-mist-700">Chargement du projet...</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/dashboard/projects" className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-mist-400 hover:text-mist-700">
            <ArrowLeft className="h-3.5 w-3.5" />
            Mes projets
          </Link>
          <h1 className="font-display text-2xl font-semibold text-mist-900">{project.title}</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Supprimer
        </Button>
      </div>

      <ProjectForm project={project} onSubmit={handleSubmit} submitLabel="Enregistrer les modifications" />
    </div>
  );
}