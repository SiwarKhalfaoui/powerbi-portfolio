import { Response } from 'express';

/**
 * Every successful response follows the same envelope so the frontend
 * can rely on a single shape: { success, message, data }.
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
}
