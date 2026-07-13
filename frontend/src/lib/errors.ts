import { AxiosError } from 'axios';
import { ApiErrorBody } from '../types';

export function getErrorMessage(error: unknown, fallback = 'Une erreur est survenue.'): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.message) return body.message;
    if (error.message === 'Network Error') {
      return "Impossible de joindre le serveur. Vérifiez votre connexion.";
    }
  }
  return fallback;
}
