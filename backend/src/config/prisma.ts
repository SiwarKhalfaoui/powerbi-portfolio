import { PrismaClient } from '@prisma/client';
import { isProduction } from './env';

/**
 * A single PrismaClient instance is reused across the app.
 * In dev, tsx's hot-reload can otherwise spawn multiple clients and
 * exhaust Postgres connections, so we cache it on `globalThis`.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProduction ? ['error', 'warn'] : ['error', 'warn'],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}
