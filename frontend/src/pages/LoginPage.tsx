import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../features/auth/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Bon retour"
      title="Connectez-vous à votre compte"
      subtitle="Accédez à votre tableau de bord et continuez à construire votre portfolio."
    >
      <LoginForm />
    </AuthLayout>
  );
}
