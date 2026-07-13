import { useAuth } from '../features/auth/useAuth';
import { Card } from '../components/ui/Card';
import { ProfileForm } from '../features/profile/ProfileForm';
import { ChangePasswordForm } from '../features/profile/ChangePasswordForm';

export function ProfileEditPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-teal-700">
          Paramètres
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-mist-900">Mon profil</h1>
        <p className="mt-1 text-sm text-mist-700">
          Ces informations seront utilisées pour construire votre portfolio public.
        </p>
      </div>

      <Card>
        <ProfileForm user={user} />
      </Card>

      <div>
        <h2 className="font-display text-lg font-semibold text-mist-900">Sécurité</h2>
        <p className="mt-1 text-sm text-mist-700">
          Changer votre mot de passe déconnectera toutes vos sessions actives.
        </p>
      </div>
      <Card>
        <ChangePasswordForm />
      </Card>
    </div>
  );
}
