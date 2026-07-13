import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import * as usersService from './users.service';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await usersService.getUserById(req.user.id);
  return sendSuccess(res, 200, 'Profile retrieved', { user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await usersService.updateProfile(req.user.id, req.body);
  return sendSuccess(res, 200, 'Profile updated', { user });
});

export const changeMyPassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  await usersService.changePassword(req.user.id, req.body);
  return sendSuccess(res, 200, 'Password changed successfully. Please log in again.');
});
