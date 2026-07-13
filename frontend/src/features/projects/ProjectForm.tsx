import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { ImageUploadField } from './ImageUploadField';
import { projectFormSchema, ProjectFormValues, arrayToCsv, toProjectPayload } from './projectsValidation';
import { ProjectFormPayload } from './projectsApi';
import { getErrorMessage } from '../../lib/errors';
import {
  Project,
  PROJECT_TYPE_LABELS,
  PROJECT_LEVEL_LABELS,
  PROJECT_STATUS_LABELS,
} from '../../types';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (payload: ProjectFormPayload) => Promise<void>;
  submitLabel: string;
}

export function ProjectForm({ project, onSubmit, submitLabel }: ProjectFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(project?.coverImageUrl ?? null);
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>(project?.galleryImageUrls ?? []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? '',
      shortDescription: project?.shortDescription ?? '',
      description: project?.description ?? '',
      businessDomain: project?.businessDomain ?? '',
      projectType: project?.projectType ?? 'DASHBOARD',
      toolsUsed: arrayToCsv(project?.toolsUsed ?? []),
      level: project?.level ?? 'BEGINNER',
      interactiveLink: project?.interactiveLink ?? '',
      ownershipConfirmed: project?.ownershipConfirmed ?? false,
      videoUrl: project?.videoUrl ?? '',
      datasetUrl: project?.datasetUrl ?? '',
      results: project?.results ?? '',
      tags: arrayToCsv(project?.tags ?? []),
      status: project?.status ?? 'DRAFT',
    },
  });

  async function submit(values: ProjectFormValues) {
    setServerError(null);
    try {
      const payload = toProjectPayload(values, { coverImageUrl, galleryImageUrls });
      await onSubmit(payload);
    } catch (err) {
      setServerError(getErrorMessage(err, "Impossible d'enregistrer le projet."));
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-8">
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <section className="space-y-5">
        <h2 className="font-display text-base font-semibold text-mist-900">Informations générales</h2>

        <div>
          <Label htmlFor="title">Titre du projet</Label>
          <Input
            id="title"
            placeholder="Ex. Dashboard de ventes retail"
            hasError={Boolean(errors.title)}
            {...register('title')}
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <Label htmlFor="shortDescription">Description courte</Label>
          <Input
            id="shortDescription"
            placeholder="Résumé en une phrase"
            hasError={Boolean(errors.shortDescription)}
            {...register('shortDescription')}
          />
          <FieldError message={errors.shortDescription?.message} />
        </div>

        <div>
          <Label htmlFor="description">Description détaillée</Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Contexte, problématique métier, solution développée..."
            hasError={Boolean(errors.description)}
            {...register('description')}
          />
          <FieldError message={errors.description?.message} />
        </div>
      </section>

      <section className="space-y-5 border-t border-mist-200 pt-6">
        <h2 className="font-display text-base font-semibold text-mist-900">Classification</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="businessDomain">Domaine métier</Label>
            <Input id="businessDomain" placeholder="Finance, RH, Sales..." {...register('businessDomain')} />
          </div>
          <div>
            <Label htmlFor="projectType">Type de projet</Label>
            <Select id="projectType" {...register('projectType')}>
              {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="level">Niveau</Label>
            <Select id="level" {...register('level')}>
              {Object.entries(PROJECT_LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select id="status" {...register('status')}>
              {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="toolsUsed">Outils utilisés</Label>
          <Input id="toolsUsed" placeholder="Power BI, DAX, SQL, Excel" {...register('toolsUsed')} />
          <p className="mt-1.5 text-xs text-mist-400">Séparez chaque outil par une virgule.</p>
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="Power BI, Finance, KPI" {...register('tags')} />
        </div>
      </section>

      <section className="space-y-5 border-t border-mist-200 pt-6">
        <h2 className="font-display text-base font-semibold text-mist-900">Images</h2>

        <ImageUploadField
          label="Image de couverture"
          images={coverImageUrl ? [coverImageUrl] : []}
          onChange={(images) => setCoverImageUrl(images[0] ?? null)}
          helpText="Aperçu visuel principal du dashboard. JPEG, PNG, WEBP ou GIF, 5MB max."
        />

        <ImageUploadField
          label="Galerie (captures supplémentaires)"
          images={galleryImageUrls}
          onChange={setGalleryImageUrls}
          multiple
          maxImages={10}
        />
      </section>

      <section className="space-y-5 border-t border-mist-200 pt-6">
        <h2 className="font-display text-base font-semibold text-mist-900">Intégration & liens</h2>

        <div>
          <Label htmlFor="interactiveLink">Lien Power BI interactif</Label>
          <Input
            id="interactiveLink"
            placeholder="https://app.powerbi.com/view?r=..."
            hasError={Boolean(errors.interactiveLink)}
            {...register('interactiveLink')}
          />
          <FieldError message={errors.interactiveLink?.message} />
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-mist-200 bg-mist-50 px-3.5 py-3">
          <input
            id="ownershipConfirmed"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-mist-200 text-teal focus-visible:ring-2 focus-visible:ring-teal"
            {...register('ownershipConfirmed')}
          />
          <label htmlFor="ownershipConfirmed" className="text-sm text-mist-700">
            Je confirme détenir les droits sur ce rapport et être autorisé à le publier.
          </label>
        </div>
        <FieldError message={errors.ownershipConfirmed?.message} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="videoUrl">Vidéo de démonstration</Label>
            <Input id="videoUrl" placeholder="https://..." hasError={Boolean(errors.videoUrl)} {...register('videoUrl')} />
            <FieldError message={errors.videoUrl?.message} />
          </div>
          <div>
            <Label htmlFor="datasetUrl">Source des données</Label>
            <Input id="datasetUrl" placeholder="https://..." hasError={Boolean(errors.datasetUrl)} {...register('datasetUrl')} />
            <FieldError message={errors.datasetUrl?.message} />
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-mist-200 pt-6">
        <h2 className="font-display text-base font-semibold text-mist-900">Résultats</h2>
        <div>
          <Label htmlFor="results">Gains, KPI, décisions facilitées</Label>
          <Textarea id="results" rows={3} placeholder="Ex. -15% de délai de reporting mensuel" {...register('results')} />
        </div>
      </section>

      <div className="flex justify-end border-t border-mist-200 pt-6">
        <Button type="submit" variant="accent" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}