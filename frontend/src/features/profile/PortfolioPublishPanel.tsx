import { useState } from 'react';
import { Check, Copy, AlertCircle, ExternalLink, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/useAuth';
import { setPortfolioPublishedRequest, previewPortfolioRequest } from './portfolioApi';
import { getErrorMessage } from '../../lib/errors';

export function PortfolioPublishPanel() {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const publicUrl = user.slug ? `${window.location.origin}/${user.slug}` : null;

  async function handleToggle() {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await setPortfolioPublishedRequest(!user!.portfolioPublished);
      updateUser(updated);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de mettre à jour la visibilité du portfolio.'));
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePreview() {
    setIsPreviewing(true);
    setError(null);
    try {
      const updated = await previewPortfolioRequest();
      updateUser(updated);
      if (updated.slug) {
        window.open(`${window.location.origin}/${updated.slug}`, '_blank', 'noopener');
      }
    } catch (err) {
      setError(getErrorMessage(err, "Impossible de générer l'aperçu."));
    } finally {
      setIsPreviewing(false);
    }
  }

  async function handleCopy() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3.5 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-mist-900">
            {user.portfolioPublished ? 'Portfolio publié' : 'Portfolio non publié'}
          </p>
          <p className="mt-1 text-xs text-mist-700">
            {user.portfolioPublished
              ? "Votre portfolio est visible publiquement à l'URL ci-dessous."
              : 'Activez la publication pour le rendre visible à tous, ou prévisualisez-le avant.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!user.portfolioPublished && (
            <Button variant="outline" size="sm" isLoading={isPreviewing} onClick={handlePreview}>
              <Eye className="h-4 w-4" />
              Prévisualiser
            </Button>
          )}
          <Button
            variant={user.portfolioPublished ? 'ghost' : 'accent'}
            size="sm"
            isLoading={isSaving}
            onClick={handleToggle}
          >
            {user.portfolioPublished ? 'Dépublier' : 'Publier mon portfolio'}
          </Button>
        </div>
      </div>

      {publicUrl && (
        <div className="space-y-4 border-t border-mist-200 pt-4">
          {!user.portfolioPublished && (
            <div className="flex items-center gap-2 rounded-lg bg-amber/10 px-3.5 py-3 text-sm text-amber-600">
              <Eye className="h-4 w-4 shrink-0" />
              Cette URL n'est visible que par vous tant que le portfolio n'est pas publié.
            </div>
          )}

          <div className="flex items-center gap-2">
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center gap-1.5 truncate rounded-lg border border-mist-200 px-3 py-2 text-sm text-teal-700 hover:bg-mist-100"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{publicUrl}</span>
            </a>
            <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copié' : 'Copier'}
            </Button>
          </div>

          {user.portfolioPublished && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-mist-200 bg-mist-50 p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}`}
                alt="QR code du portfolio"
                width={180}
                height={180}
                className="rounded-lg"
              />
              <p className="text-xs text-mist-400">Scannez pour ouvrir le portfolio</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}