import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { resetPasswordRequest } from './authApi';
import { resetPasswordFormSchema, ResetPasswordFormValues } from './authValidation';
import { getErrorMessage } from '../../lib/errors';

export function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordFormSchema) });

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null);
    try {
      await resetPasswordRequest({ token, newPassword: values.newPassword });
      setSuccess(true);
    } catch (err) {
      setServerError(
        getErrorMessage(err, 'Ce lien est invalide ou a expiré. Demandez-en un nouveau.'),
      );
    }
  }

  if (success) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-2 rounded-lg bg-teal/10 px-3.5 py-3 text-sm text-teal-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Votre mot de passe a été réinitialisé avec succès.</span>
        </div>
        <Button variant="accent" className="w-full" onClick={() => navigate('/login', { replace: true })}>
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {serverError}{' '}
            <Link to="/forgot-password" className="font-medium underline">
              Demander un nouveau lien
            </Link>
          </span>
        </div>
      )}

      <div>
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.newPassword)}
          {...register('newPassword')}
        />
        {errors.newPassword ? (
          <FieldError message={errors.newPassword.message} />
        ) : (
          <p className="mt-1.5 text-xs text-mist-400">
            8 caractères minimum, avec majuscule, minuscule et chiffre.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.confirmPassword)}
          {...register('confirmPassword')}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <Button type="submit" variant="accent" className="w-full" isLoading={isSubmitting}>
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}