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
import { signupSchema, SignupFormValues } from './authValidation';
import { getErrorMessage } from '../../lib/errors';

const fieldClass =
  'border-white/10 bg-white/5 text-white placeholder:text-mist-500 focus-visible:ring-offset-0';

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-mist-200">
            Prénom
          </Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder="Jean"
            hasError={Boolean(errors.firstName)}
            className={fieldClass}
            {...register('firstName')}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-mist-200">
            Nom
          </Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder="Dupont"
            hasError={Boolean(errors.lastName)}
            className={fieldClass}
            {...register('lastName')}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-mist-200">
          Adresse email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          hasError={Boolean(errors.email)}
          className={fieldClass}
          {...register('email')}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="password" className="text-mist-200">
          Mot de passe
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          hasError={Boolean(errors.password)}
          className={fieldClass}
          {...register('password')}
        />
        {errors.password ? (
          <FieldError message={errors.password.message} />
        ) : (
          <p className="mt-1.5 text-xs text-mist-500">
            8 caractères minimum, avec majuscule, minuscule et chiffre.
          </p>
        )}
      </div>

      <Button type="submit" variant="accent" className="w-full" isLoading={isSubmitting}>
        Créer mon compte
      </Button>

      <p className="text-center text-sm text-mist-400">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-medium text-teal hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}