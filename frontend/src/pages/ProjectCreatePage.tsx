import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '../features/projects/ProjectForm';
import { createProjectRequest, ProjectFormPayload } from '../features/projects/projectsApi';

export function ProjectCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(payload: ProjectFormPayload) {
    await createProjectRequest(payload);
    navigate('/dashboard/projects', { replace: true });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-teal-700">
          Nouveau projet
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-mist-900">
          Ajouter un projet Power BI
        </h1>
        <p className="mt-1 text-sm text-mist-700">
          Il sera enregistré en brouillon — vous choisissez quand le publier.
        </p>
      </div>

      <ProjectForm onSubmit={handleSubmit} submitLabel="Créer le projet" />
    </div>
  );
}