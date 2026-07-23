import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Award, ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  listCertificationsRequest,
  createCertificationRequest,
  updateCertificationRequest,
  deleteCertificationRequest,
} from './credentialsApi';
import { certificationFormSchema, CertificationFormValues } from './credentialsValidation';
import { getErrorMessage } from '../../lib/errors';
import { Certification } from '../../types';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' });

export function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemPendingDelete, setItemPendingDelete] = useState<Certification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: { name: '', issuer: '', issueDate: '', credentialUrl: '' },
  });

  useEffect(() => {
    listCertificationsRequest()
      .then(setCertifications)
      .catch((err) => setError(getErrorMessage(err, 'Impossible de charger les certifications.')));
  }, []);

  function openAddForm() {
    reset({ name: '', issuer: '', issueDate: '', credentialUrl: '' });
    setEditingId(null);
    setIsFormOpen(true);
  }

  function openEditForm(c: Certification) {
    reset({
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate ? c.issueDate.slice(0, 10) : '',
      credentialUrl: c.credentialUrl ?? '',
    });
    setEditingId(c.id);
    setIsFormOpen(true);
  }

  async function onSubmit(values: CertificationFormValues) {
    setError(null);
    const payload = {
      name: values.name,
      issuer: values.issuer,
      issueDate: values.issueDate || null,
      credentialUrl: values.credentialUrl || '',
    };
    try {
      if (editingId) {
        const updated = await updateCertificationRequest(editingId, payload);
        setCertifications((prev) => prev?.map((c) => (c.id === editingId ? updated : c)) ?? null);
      } else {
        const created = await createCertificationRequest(payload);
        setCertifications((prev) => [created, ...(prev ?? [])]);
      }
      setIsFormOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "Impossible d'enregistrer cette certification."));
    }
  }

  async function confirmDelete() {
    if (!itemPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteCertificationRequest(itemPendingDelete.id);
      setCertifications((prev) => prev?.filter((c) => c.id !== itemPendingDelete.id) ?? null);
      setItemPendingDelete(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de supprimer cette certification.'));
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
        {certifications?.map((c) => (
          <div key={c.id} className="flex items-start justify-between gap-3 rounded-lg border border-mist-200 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber-600">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-mist-900">{c.name}</p>
                <p className="text-sm text-mist-700">{c.issuer}</p>
                {c.issueDate && (
                  <p className="mt-0.5 text-xs text-mist-400">{dateFormatter.format(new Date(c.issueDate))}</p>
                )}
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline"
                  >
                    Voir le certificat
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => openEditForm(c)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-mist-100"
                aria-label="Modifier"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setItemPendingDelete(c)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-700 hover:bg-danger-50 hover:text-danger"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {certifications?.length === 0 && !isFormOpen && (
          <p className="text-sm text-mist-400">Aucune certification ajoutée pour le moment.</p>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4 rounded-lg border border-mist-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-mist-900">
              {editingId ? 'Modifier la certification' : 'Nouvelle certification'}
            </p>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-mist-400 hover:text-mist-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cert-name">Nom de la certification</Label>
              <Input id="cert-name" placeholder="PL-300: Power BI Data Analyst" hasError={Boolean(errors.name)} {...register('name')} />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="cert-issuer">Organisme émetteur</Label>
              <Input id="cert-issuer" placeholder="Microsoft" hasError={Boolean(errors.issuer)} {...register('issuer')} />
              <FieldError message={errors.issuer?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cert-date">Date d'obtention</Label>
              <Input id="cert-date" type="date" {...register('issueDate')} />
            </div>
            <div>
              <Label htmlFor="cert-url">Lien du certificat</Label>
              <Input id="cert-url" placeholder="https://..." hasError={Boolean(errors.credentialUrl)} {...register('credentialUrl')} />
              <FieldError message={errors.credentialUrl?.message} />
            </div>
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
          Ajouter une certification
        </Button>
      )}

      <ConfirmDialog
        open={Boolean(itemPendingDelete)}
        title="Supprimer cette certification ?"
        description={`« ${itemPendingDelete?.name} » sera supprimée.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setItemPendingDelete(null)}
      />
    </div>
  );
}