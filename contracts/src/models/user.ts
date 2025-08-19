import { type ZodType, z } from 'zod/v4'

export interface User {
  id: number
  name: string
  score: number
  archivedAt?: string
}

export interface UserCreate {
  name: string
}

export const USER_SCHEMA = z.object({
  id: z.number(),
  name: z.string().trim().nonempty(),
  score: z.number(),
  archivedAt: z.iso.datetime().optional(),
}) satisfies ZodType<User>

export const USER_CREATE_SCHEMA = z.object({
  name: USER_SCHEMA.shape.name,
}) satisfies ZodType<UserCreate>
