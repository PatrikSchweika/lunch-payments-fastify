import { type ZodType, z } from 'zod/v4'

export interface User {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export const USER_SCHEMA = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies ZodType<User>
