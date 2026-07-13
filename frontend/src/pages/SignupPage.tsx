import { AuthLayout } from '../components/layout/AuthLayout';
import { SignupForm } from '../features/auth/SignupForm';

export function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Bienvenue"
      title="Créez votre compte"
      subtitle="Rejoignez la communauté Power BI, Data & AI en quelques secondes."
    >
      <SignupForm />
    </AuthLayout>
  );
}
