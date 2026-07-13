import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ResetPasswordForm } from '../features/auth/ResetPasswordForm';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <AuthLayout
      eyebrow="Nouveau mot de passe"
      title="Choisissez un nouveau mot de passe"
      subtitle="Ce lien est valable une heure et ne peut être utilisé qu'une seule fois."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-5">
          <div className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Ce lien de réinitialisation est incomplet ou invalide.</span>
          </div>
          <p className="text-center text-sm text-mist-700">
            <Link to="/forgot-password" className="font-medium text-teal-700 hover:underline">
              Demander un nouveau lien
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}