import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist-50 px-6 text-center">
      <p className="font-mono text-sm font-medium text-teal-700">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-mist-900">
        Cette page n'existe pas
      </h1>
      <p className="mt-2 max-w-sm text-sm text-mist-700">
        Le lien que vous avez suivi est peut-être incorrect, ou la page a été déplacée.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Retour à l'accueil</Button>
      </Link>
    </div>
  );
}
