import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getErrorMessage } from '../../lib/errors';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

interface GoogleSignInButtonProps {
  /** Surfaces a failure the same way the form's own serverError does. */
  onError: (message: string) => void;
}

/**
 * Renders Google's native "Sign in with Google" button (via the GIS script
 * loaded in index.html) and exchanges the resulting credential for our own
 * session through useAuth().loginWithGoogle — same destination (/dashboard)
 * and same store update as password login.
 */
export function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('VITE_GOOGLE_CLIENT_ID is not set — Google Sign-In is disabled.');
      return;
    }

    let cancelled = false;
    let attempts = 0;

    async function handleCredentialResponse(response: { credential: string }) {
      try {
        await loginWithGoogle(response.credential);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        onError(getErrorMessage(err, 'La connexion avec Google a échoué. Réessayez.'));
      }
    }

    // The GIS script is loaded async/defer in index.html, so it may not
    // have executed yet when this component mounts — poll briefly instead
    // of assuming window.google already exists.
    function tryInit() {
      if (cancelled) return;
      attempts += 1;

      if (window.google?.accounts?.id && containerRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: containerRef.current.offsetWidth || 360,
        });
        setIsReady(true);
        return;
      }

      if (attempts < 50) {
        setTimeout(tryInit, 100);
      } else {
        console.error('Google Identity Services failed to load.');
      }
    }

    tryInit();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      {!isReady && <div className="h-11 w-full animate-pulse rounded-lg bg-mist-100" aria-hidden="true" />}
      <div ref={containerRef} className={isReady ? 'flex justify-center' : 'hidden'} />
    </div>
  );
}