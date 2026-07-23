import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, GraduationCap, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  listFormationsRequest,
  createFormationRequest,
  updateFormationRequest,
  deleteFormationRequest,
} from './credentialsApi';
import { formationFormSchema, FormationFormValues } from './credentialsValidation';
import { getErrorMessage } from '../../lib/errors';
import { Formation } from '../../types';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' });
function formatRange(f: Formation) {
  if (!f.startDate && !f.endDate && !f.isCurrent) return null;
  const start = f.startDate ? dateFormatter.format(new Date(f.startDate)) : '';
  const end = f.isCurrent ? "Aujourd'hui" : f.endDate ? dateFormatter.format(new Date(f.endDate)) : '';
  return [start, end].filter(Boolean).join(' — ');
}

export function FormationsManager() {
  const [formations, setFormations] = useState<Formation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemPendingDelete, setItemPendingDelete] = useState<Formation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormationFormValues>({
    resolver: zodResolver(formationFormSchema),
    defaultValues: { degree: '', institution: '', startDate: '', endDate: '', isCurrent: false, description: '' },
  });
  const isCurrent = watch('isCurrent');

  useEffect(() => {
    listFormationsRequest()
      .then(setFormations)
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger les formations.')));
  }, []);

  function openAddForm() {
    reset({ degree: '', institution: '', startDate: '', endDate: '', isCurrent: false, description: '' });
    setEditingId(null);
    setIsFormOpen(true);
  }

  function openEditForm(f: Formation) {
    reset({
      degree: f.degree,
      institution: f.institution,
      startDate: f.startDate ? f.startDate.slice(0, 10) : '',
      endDate: f.endDate ? f.endDate.slice(0, 10) : '',
      isCurrent: f.isCurrent,
      description: f.description ?? '',
    });
    setEditingId(f.id);
    setIsFormOpen(true);
  }

  async function onSubmit(values: FormationFormValues) {
    setError(null);
    const payload = {
      degree: values.degree,
      institution: values.institution,
      startDate: values.startDate || null,
      endDate: values.isCurrent ? null : values.endDate || null,
      isCurrent: values.isCurrent,
      description: values.description || '',
    };
    try {
      if (editingId) {
        const updated = await updateFormationRequest(editingId, payload);
        setFormations((prev) => prev?.map((f) => (f.id === editingId ? updated : f)) ?? null);
      } else {
        const created = await createFormationRequest(payload);
        setFormations((prev) => [created, ...(prev ?? [])]);
      }
      setIsFormOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'enregistrer cette formation."));
    }
  }

  async function confirmDelete() {
    if (!itemPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteFormationRequest(itemPendingDelete.id);
      setFormations((prev) => prev?.filter((f) => f.id !== itemPendingDelete.id) ?? null);
      setItemPendingDelete(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de supprimer cette formation.'));
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
        {formations?.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-3 rounded-lg border border-mist-200 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet-600">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-mist-900">{f.degree}</p>
                <p className="text-sm text-mist-700">{f.institution}</p>
                {formatRange(f) && <p className="mt-0.5 text-xs text-mist-400">{formatRange(f)}</p>}
                {f.description && <p className="mt-1.5 text-sm text-mist-700">{f.description}</p>}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => openEditForm(f)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-mist-100"
                aria-label="Modifier"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setItemPendingDelete(f)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-danger-50 hover:text-danger"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {formations?.length === 0 && !isFormOpen && (
          <p className="text-sm text-mist-400">Aucune formation ajoutée pour le moment.</p>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4 rounded-lg border border-mist-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-mist-900">
              {editingId ? 'Modifier la formation' : 'Nouvelle formation'}
            </p>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-mist-400 hover:text-mist-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="form-degree">Diplôme</Label>
              <Input id="form-degree" hasError={Boolean(errors.degree)} {...register('degree')} />
              <FieldError message={errors.degree?.message} />
            </div>
            <div>
              <Label htmlFor="form-institution">Établissement</Label>
              <Input id="form-institution" hasError={Boolean(errors.institution)} {...register('institution')} />
              <FieldError message={errors.institution?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="form-start">Date de début</Label>
              <Input id="form-start" type="date" {...register('startDate')} />
            </div>
            <div>
              <Label htmlFor="form-end">Date de fin</Label>
              <Input id="form-end" type="date" disabled={isCurrent} {...register('endDate')} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-mist-700">
            <input type="checkbox" className="h-4 w-4 rounded border-mist-200 text-teal" {...register('isCurrent')} />
            En cours
          </label>

          <div>
            <Label htmlFor="form-description">Description</Label>
            <Textarea id="form-description" rows={3} {...register('description')} />
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
          Ajouter une formation
        </Button>
      )}

      <ConfirmDialog
        open={Boolean(itemPendingDelete)}
        title="Supprimer cette formation ?"
        description={`« ${itemPendingDelete?.degree} » sera supprimée.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setItemPendingDelete(null)}
      />
    </div>
  );
}