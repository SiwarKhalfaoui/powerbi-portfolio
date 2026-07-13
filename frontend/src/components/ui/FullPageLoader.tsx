import { Loader2 } from 'lucide-react';

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-50">
      <Loader2 className="h-6 w-6 animate-spin text-teal-700" aria-label="Chargement" />
    </div>
  );
}
