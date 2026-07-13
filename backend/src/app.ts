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

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}