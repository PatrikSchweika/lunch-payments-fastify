import { z } from 'zod/v4'

export enum AuthUserRole {
  User = 'User',
  Admin = 'Admin',
}

export interface AuthUser {
  username: string
  role: AuthUserRole
}

export const AUTH_USER_SCHEMA = z.object({
  username: z.string().nonempty(),
  role: z.enum(AuthUserRole),
}) satisfies z.ZodType<AuthUser>
