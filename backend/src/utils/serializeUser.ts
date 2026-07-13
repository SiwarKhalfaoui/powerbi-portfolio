import { User } from '@prisma/client';

export type PublicUser = Omit<User, 'passwordHash'>;

/** Removes passwordHash (and any future sensitive fields) before a User
 * object is ever sent in an API response. */
export function serializeUser(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
