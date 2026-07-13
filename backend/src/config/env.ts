import 'dotenv/config';
import { z } from 'zod';

/**
 * All environment variables are validated once at startup.
 * If anything required is missing or malformed, the process fails fast
 * with a clear message instead of crashing later mid-request.
 */
const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    CLIENT_URL: z.string().url(),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
    JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    PASSWORD_RESET_SECRET: z
      .string()
      .min(16, 'PASSWORD_RESET_SECRET must be at least 16 characters'),
    PASSWORD_RESET_TOKEN_EXPIRES_IN: z.string().default('1h'),

    // "console" logs the reset link to the server terminal instead of
    // sending a real email — kept only as a safety fallback. Set
    // EMAIL_PROVIDER=smtp to actually send, which requires the SMTP_* vars.
    EMAIL_PROVIDER: z.enum(['console', 'smtp']).default('console'),
    EMAIL_FROM: z.string().default('Dr.D Portfolio <no-reply@drd-portfolio.com>'),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().optional(),
    SMTP_SECURE: z
      .string()
      .optional()
      .transform((val) => val === 'true'),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),

    COOKIE_SECURE: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),
  })
  .refine(
    (data) =>
      data.EMAIL_PROVIDER !== 'smtp' ||
      (data.SMTP_HOST && data.SMTP_PORT && data.SMTP_USER && data.SMTP_PASSWORD),
    {
      message:
        'SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD are required when EMAIL_PROVIDER=smtp',
      path: ['SMTP_HOST'],
    },
  );

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
export const isProduction = env.NODE_ENV === 'production';