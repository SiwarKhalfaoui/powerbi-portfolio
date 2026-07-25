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
import { loginSchema, LoginFormValues } from './authValidation';
import { getErrorMessage } from '../../lib/errors';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await login(values);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Email ou mot de passe incorrect.'));
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
          className="border-white/10 bg-white/5 text-white placeholder:text-mist-500 focus-visible:ring-offset-0"
          {...register('email')}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-mist-200">
            Mot de passe
          </Label>
          <Link to="/forgot-password" className="text-xs font-medium text-teal hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          hasError={Boolean(errors.password)}
          className="border-white/10 bg-white/5 text-white placeholder:text-mist-500 focus-visible:ring-offset-0"
          {...register('password')}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <Button type="submit" variant="accent" className="w-full" isLoading={isSubmitting}>
        Se connecter
      </Button>

      <p className="text-center text-sm text-mist-400">
        Pas encore de compte ?{' '}
        <Link to="/signup" className="font-medium text-teal hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}