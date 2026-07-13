import jwt, { JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

export interface AccessTokenPayload extends JwtPayload {
  sub: string; // userId
  role: Role;
}

export function signAccessToken(payload: { userId: string; role: Role }): string {
  return jwt.sign({ sub: payload.userId, role: payload.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}
