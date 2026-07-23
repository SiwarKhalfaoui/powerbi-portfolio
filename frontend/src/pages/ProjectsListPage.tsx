import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronDown, ChevronUp, FolderKanban, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ProjectCard } from '../features/projects/ProjectCard';
import {
  listMyProjectsRequest,
  deleteProjectRequest,
  reorderProjectsRequest,
} from '../features/projects/projectsApi';
import { getErrorMessage } from '../lib/errors';
import { Project } from '../types';

export function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectPendingDelete, setProjectPendingDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    listMyProjectsRequest()
      .then(setProjects)
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger vos projets.')));
  }, []);

  async function confirmDelete() {
    if (!projectPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteProjectRequest(projectPendingDelete.id);
      setProjects((prev) => prev?.filter((p) => p.id !== projectPendingDelete.id) ?? null);
      setProjectPendingDelete(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de supprimer ce projet.'));
    } finally {
      setIsDeleting(false);
    }
  }

  // doc Module 3 — "définir l'ordre des projets". Swaps the project at
  // `index` with its neighbor, optimistically updates the UI, then
  // persists the full new order. Reverts on failure.
  async function moveProject(index: number, direction: -1 | 1) {
    if (!projects) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    const previous = projects;
    setProjects(reordered);
    setIsReordering(true);
    try {
      await reorderProjectsRequest(reordered.map((p) => p.id));
    } catch (err) {
      setProjects(previous);
      setError(getErrorMessage(err, "Impossible d'enregistrer le nouvel ordre."));
    } finally {
      setIsReordering(false);
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

      {projects && projects.length > 1 && (
        <p className="text-xs text-mist-400">
          Utilisez les flèches pour définir l'ordre d'affichage sur votre portfolio public.
        </p>
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div key={project.id} className="relative">
              <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-lg border border-mist-200 bg-white shadow-card">
                <button
                  type="button"
                  onClick={() => moveProject(index, -1)}
                  disabled={index === 0 || isReordering}
                  className="flex h-7 w-7 items-center justify-center text-mist-700 hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Monter"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveProject(index, 1)}
                  disabled={index === projects.length - 1 || isReordering}
                  className="flex h-7 w-7 items-center justify-center border-t border-mist-200 text-mist-700 hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Descendre"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <ProjectCard project={project} onDelete={setProjectPendingDelete} />
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(projectPendingDelete)}
        title="Supprimer ce projet ?"
        description={`« ${projectPendingDelete?.title} » sera définitivement supprimé, ainsi que ses images. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setProjectPendingDelete(null)}
      />
    </div>
  );
}