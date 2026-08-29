import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { FieldError } from '../../components/ui/FieldError';
import { Button } from '../../components/ui/Button';
import { useAuth } from './useAuth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { signupSchema, SignupFormValues } from './authValidation';
import { getErrorMessage } from '../../lib/errors';

export function SignupForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      await registerUser(values);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Impossible de créer le compte.'));
    }
  }

  return (
    <div className="space-y-5">
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <GoogleSignInButton onError={setServerError} />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-mist-200" />
        <span className="text-xs font-medium text-mist-400">ou</span>
        <div className="h-px flex-1 bg-mist-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              placeholder="Jean"
              hasError={Boolean(errors.firstName)}
              {...register('firstName')}
            />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="Dupont"
              hasError={Boolean(errors.lastName)}
              {...register('lastName')}
            />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

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

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            hasError={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password ? (
            <FieldError message={errors.password.message} />
          ) : (
            <p className="mt-1.5 text-xs text-mist-400">
              8 caractères minimum, avec majuscule, minuscule et chiffre.
            </p>
          )}
        </div>

        <Button type="submit" variant="accent" className="w-full" isLoading={isSubmitting}>
          Créer mon compte
        </Button>

        <p className="text-center text-sm text-mist-700">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-teal-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}