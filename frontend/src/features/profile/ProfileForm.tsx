import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/useAuth';
import { updateProfileRequest } from './profileApi';
import { profileFormSchema, ProfileFormValues } from './profileValidation';
import { getErrorMessage } from '../../lib/errors';
import { AVAILABILITY_LABELS, User } from '../../types';

function arrayToCsv(items: string[]) {
  return items.join(', ');
}

function csvToArray(value?: string) {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function ProfileForm({ user }: { user: User }) {
  const { updateUser } = useAuth();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      professionalTitle: user.professionalTitle ?? '',
      bio: user.bio ?? '',
      country: user.country ?? '',
      city: user.city ?? '',
      languages: arrayToCsv(user.languages),
      skills: arrayToCsv(user.skills),
      availability: user.availability,
      linkedinUrl: user.linkedinUrl ?? '',
      githubUrl: user.githubUrl ?? '',
      websiteUrl: user.websiteUrl ?? '',
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setStatus('idle');
    setErrorMessage(null);
    try {
      const updated = await updateProfileRequest({
        firstName: values.firstName,
        lastName: values.lastName,
        professionalTitle: values.professionalTitle || null,
        bio: values.bio || null,
        country: values.country || null,
        city: values.city || null,
        languages: csvToArray(values.languages),
        skills: csvToArray(values.skills),
        availability: values.availability,
        linkedinUrl: values.linkedinUrl || null,
        githubUrl: values.githubUrl || null,
        websiteUrl: values.websiteUrl || null,
      });
      updateUser(updated);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(getErrorMessage(err, 'Impossible de mettre à jour le profil.'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-lg bg-teal/10 px-3.5 py-3 text-sm text-teal-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Profil mis à jour avec succès.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <section className="space-y-5">
        <h2 className="font-display text-base font-semibold text-mist-900">Identité</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" hasError={Boolean(errors.firstName)} {...register('firstName')} />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" hasError={Boolean(errors.lastName)} {...register('lastName')} />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="professionalTitle">Titre professionnel</Label>
          <Input
            id="professionalTitle"
            placeholder="Ex. Data Analyst Power BI"
            hasError={Boolean(errors.professionalTitle)}
            {...register('professionalTitle')}
          />
          <FieldError message={errors.professionalTitle?.message} />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="Présentez votre parcours et vos réalisations en quelques phrases."
            hasError={Boolean(errors.bio)}
            {...register('bio')}
          />
          <FieldError message={errors.bio?.message} />
        </div>
      </section>

      <section className="space-y-5 border-t border-mist-200 pt-6">
        <h2 className="font-display text-base font-semibold text-mist-900">Localisation & disponibilité</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="country">Pays</Label>
            <Input id="country" {...register('country')} />
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input id="city" {...register('city')} />
          </div>
        </div>
        <div>
          <Label htmlFor="availability">Disponibilité</Label>
          <Select id="availability" {...register('availability')}>
            {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-5 border-t border-mist-200 pt-6">
        <h2 className="font-display text-base font-semibold text-mist-900">Compétences & langues</h2>
        <div>
          <Label htmlFor="skills">Compétences</Label>
          <Input id="skills" placeholder="Power BI, DAX, SQL, Excel" {...register('skills')} />
          <p className="mt-1.5 text-xs text-mist-400">Séparez chaque compétence par une virgule.</p>
        </div>
        <div>
          <Label htmlFor="languages">Langues</Label>
          <Input id="languages" placeholder="Français, Anglais, Arabe" {...register('languages')} />
        </div>
      </section>

      <section className="space-y-5 border-t border-mist-200 pt-6">
        <h2 className="font-display text-base font-semibold text-mist-900">Liens</h2>
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn</Label>
          <Input
            id="linkedinUrl"
            placeholder="https://linkedin.com/in/..."
            hasError={Boolean(errors.linkedinUrl)}
            {...register('linkedinUrl')}
          />
          <FieldError message={errors.linkedinUrl?.message} />
        </div>
        <div>
          <Label htmlFor="githubUrl">GitHub</Label>
          <Input
            id="githubUrl"
            placeholder="https://github.com/..."
            hasError={Boolean(errors.githubUrl)}
            {...register('githubUrl')}
          />
          <FieldError message={errors.githubUrl?.message} />
        </div>
        <div>
          <Label htmlFor="websiteUrl">Site personnel</Label>
          <Input
            id="websiteUrl"
            placeholder="https://..."
            hasError={Boolean(errors.websiteUrl)}
            {...register('websiteUrl')}
          />
          <FieldError message={errors.websiteUrl?.message} />
        </div>
      </section>

      <div className="flex justify-end border-t border-mist-200 pt-6">
        <Button type="submit" variant="accent" isLoading={isSubmitting}>
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
