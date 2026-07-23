import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Briefcase, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  listExperiencesRequest,
  createExperienceRequest,
  updateExperienceRequest,
  deleteExperienceRequest,
} from './credentialsApi';
import { experienceFormSchema, ExperienceFormValues } from './credentialsValidation';
import { getErrorMessage } from '../../lib/errors';
import { Experience } from '../../types';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' });
function formatRange(exp: Experience) {
  const start = dateFormatter.format(new Date(exp.startDate));
  const end = exp.isCurrent ? "Aujourd'hui" : exp.endDate ? dateFormatter.format(new Date(exp.endDate)) : '';
  return `${start} — ${end}`;
}

export function ExperiencesManager() {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemPendingDelete, setItemPendingDelete] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: { title: '', company: '', startDate: '', endDate: '', isCurrent: false, description: '' },
  });
  const isCurrent = watch('isCurrent');

  useEffect(() => {
    listExperiencesRequest()
      .then(setExperiences)
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger les expériences.')));
  }, []);

  function openAddForm() {
    reset({ title: '', company: '', startDate: '', endDate: '', isCurrent: false, description: '' });
    setEditingId(null);
    setIsFormOpen(true);
  }

  function openEditForm(exp: Experience) {
    reset({
      title: exp.title,
      company: exp.company,
      startDate: exp.startDate.slice(0, 10),
      endDate: exp.endDate ? exp.endDate.slice(0, 10) : '',
      isCurrent: exp.isCurrent,
      description: exp.description ?? '',
    });
    setEditingId(exp.id);
    setIsFormOpen(true);
  }

  async function onSubmit(values: ExperienceFormValues) {
    setError(null);
    const payload = {
      title: values.title,
      company: values.company,
      startDate: values.startDate,
      endDate: values.isCurrent ? null : values.endDate || null,
      isCurrent: values.isCurrent,
      description: values.description || '',
    };
    try {
      if (editingId) {
        const updated = await updateExperienceRequest(editingId, payload);
        setExperiences((prev) => prev?.map((e) => (e.id === editingId ? updated : e)) ?? null);
      } else {
        const created = await createExperienceRequest(payload);
        setExperiences((prev) => [created, ...(prev ?? [])]);
      }
      setIsFormOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'enregistrer cette expérience."));
    }
  }

  async function confirmDelete() {
    if (!itemPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteExperienceRequest(itemPendingDelete.id);
      setExperiences((prev) => prev?.filter((e) => e.id !== itemPendingDelete.id) ?? null);
      setItemPendingDelete(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de supprimer cette expérience.'));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {experiences?.map((exp) => (
          <div key={exp.id} className="flex items-start justify-between gap-3 rounded-lg border border-mist-200 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal-700">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-mist-900">{exp.title}</p>
                <p className="text-sm text-mist-700">{exp.company}</p>
                <p className="mt-0.5 text-xs text-mist-400">{formatRange(exp)}</p>
                {exp.description && <p className="mt-1.5 text-sm text-mist-700">{exp.description}</p>}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => openEditForm(exp)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-mist-100"
                aria-label="Modifier"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setItemPendingDelete(exp)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-danger-50 hover:text-danger"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {experiences?.length === 0 && !isFormOpen && (
          <p className="text-sm text-mist-400">Aucune expérience ajoutée pour le moment.</p>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4 rounded-lg border border-mist-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-mist-900">
              {editingId ? "Modifier l'expérience" : 'Nouvelle expérience'}
            </p>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-mist-400 hover:text-mist-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="exp-title">Poste</Label>
              <Input id="exp-title" hasError={Boolean(errors.title)} {...register('title')} />
              <FieldError message={errors.title?.message} />
            </div>
            <div>
              <Label htmlFor="exp-company">Entreprise</Label>
              <Input id="exp-company" hasError={Boolean(errors.company)} {...register('company')} />
              <FieldError message={errors.company?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="exp-start">Date de début</Label>
              <Input id="exp-start" type="date" hasError={Boolean(errors.startDate)} {...register('startDate')} />
              <FieldError message={errors.startDate?.message} />
            </div>
            <div>
              <Label htmlFor="exp-end">Date de fin</Label>
              <Input id="exp-end" type="date" disabled={isCurrent} hasError={Boolean(errors.endDate)} {...register('endDate')} />
              <FieldError message={errors.endDate?.message} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-mist-700">
            <input type="checkbox" className="h-4 w-4 rounded border-mist-200 text-teal" {...register('isCurrent')} />
            Poste actuel
          </label>

          <div>
            <Label htmlFor="exp-description">Description</Label>
            <Textarea id="exp-description" rows={3} {...register('description')} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="accent" size="sm" isLoading={isSubmitting}>
              {editingId ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      ) : (
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={openAddForm}>
          <Plus className="h-4 w-4" />
          Ajouter une expérience
        </Button>
      )}

      <ConfirmDialog
        open={Boolean(itemPendingDelete)}
        title="Supprimer cette expérience ?"
        description={`« ${itemPendingDelete?.title} » chez ${itemPendingDelete?.company} sera supprimée.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setItemPendingDelete(null)}
      />
    </div>
  );
}