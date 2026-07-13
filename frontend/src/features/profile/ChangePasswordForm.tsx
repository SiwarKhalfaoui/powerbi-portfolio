import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { changePasswordRequest } from './profileApi';
import { passwordFormSchema, PasswordFormValues } from './profileValidation';
import { getErrorMessage } from '../../lib/errors';
import { useAuth } from '../auth/useAuth';

export function ChangePasswordForm() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordFormSchema) });

  async function onSubmit(values: PasswordFormValues) {
    setServerError(null);
    try {
      await changePasswordRequest({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
      // Changing the password revokes all sessions server-side —
      // send the user back through login with the new password.
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Impossible de changer le mot de passe.'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div>
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          hasError={Boolean(errors.currentPassword)}
          {...register('currentPassword')}
        />
        <FieldError message={errors.currentPassword?.message} />
      </div>

      <div>
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.newPassword)}
          {...register('newPassword')}
        />
        <FieldError message={errors.newPassword?.message} />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          hasError={Boolean(errors.confirmPassword)}
          {...register('confirmPassword')}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="outline" isLoading={isSubmitting}>
          Changer le mot de passe
        </Button>
      </div>
    </form>
  );
}
