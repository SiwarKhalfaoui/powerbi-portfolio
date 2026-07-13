import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { forgotPasswordRequest } from './authApi';
import { forgotPasswordFormSchema, ForgotPasswordFormValues } from './authValidation';
import { getErrorMessage } from '../../lib/errors';

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordFormSchema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const message = await forgotPasswordRequest(values.email);
      setSuccessMessage(message);
    } catch (err) {
      setServerError(getErrorMessage(err, "Impossible d'envoyer le lien pour le moment."));
    }
  }

  if (successMessage) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-2 rounded-lg bg-teal/10 px-3.5 py-3 text-sm text-teal-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
        <p className="text-center text-sm text-mist-700">
          <Link to="/login" className="font-medium text-teal-700 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    );
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
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          hasError={Boolean(errors.email)}
          {...register('email')}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <Button type="submit" variant="accent" className="w-full" isLoading={isSubmitting}>
        Envoyer le lien de réinitialisation
      </Button>

      <p className="text-center text-sm text-mist-700">
        <Link to="/login" className="font-medium text-teal-700 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}