import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { env, isProduction } from './config/env';
import { globalRateLimiter } from './middleware/rateLimiter';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

export function createApp() {
  const app = express();

  // Désactive l'ETag automatique d'Express sur les réponses JSON
  // dynamiques (res.json/res.send) — sans effet sur express.static
  // (/uploads) qui gère son propre cache d'images indépendamment. Sans ça,
  // le navigateur peut renvoyer un 304 et réutiliser une ancienne réponse
  // JSON en cache au lieu de réellement réinterroger l'API à chaque appel —
  // exactement ce qui vient de nous tromper sur le filtre par tag.
  app.set('etag', false);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true, // required so the browser sends/receives the refresh cookie
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.use(globalRateLimiter);

  // Uploaded project images (cover + gallery) — see middleware/upload.ts
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Renforce le no-cache explicitement sur toute l'API — belt-and-suspenders
  // en plus de app.set('etag', false) ci-dessus, pour empêcher toute mise
  // en cache heuristique côté navigateur sur des données qui changent à
  // chaque requête (galerie, compteurs de vues, statut de publication...).
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}