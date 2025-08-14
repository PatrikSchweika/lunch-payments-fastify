import { type ZodType, z } from 'zod/v4'

export interface User {
  id: number
  name: string
  score: number
}

export interface UserCreate {
  name: string
}

export const USER_SCHEMA = z.object({
  id: z.number(),
  name: z.string().trim().nonempty(),
  score: z.number(),
}) satisfies ZodType<User>

export const USER_CREATE_SCHEMA = z.object({
  name: USER_SCHEMA.shape.name,
}) satisfies ZodType<UserCreate>
