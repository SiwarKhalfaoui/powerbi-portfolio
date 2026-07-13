import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import * as authService from './auth.service';
import { REFRESH_COOKIE_NAME } from '../../utils/cookies';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body, res, req.headers['user-agent'] as string | undefined);
  return sendSuccess(res, 201, 'Account created successfully', result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body, res, req.headers['user-agent'] as string | undefined);
  return sendSuccess(res, 200, 'Logged in successfully', result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const result = await authService.refreshSession(rawToken, res, req.headers['user-agent'] as string | undefined);
  return sendSuccess(res, 200, 'Session refreshed', result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  await authService.logoutUser(rawToken, res);
  return sendSuccess(res, 200, 'Logged out successfully');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.requestPasswordReset(req.body);
  // Same message regardless of whether the email was found — see service comment.
  return sendSuccess(
    res,
    200,
    "If an account exists for this email, a reset link has been sent.",
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);
  return sendSuccess(res, 200, 'Password reset successfully. You can now log in.');
});