import { AuthLayout } from '../components/layout/AuthLayout';
import { ForgotPasswordForm } from '../features/auth/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Mot de passe oublié"
      title="Réinitialisez votre mot de passe"
      subtitle="Entrez votre adresse email : si un compte existe, nous vous enverrons un lien de réinitialisation."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}