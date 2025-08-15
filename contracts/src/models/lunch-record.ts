import { z } from 'zod/v4'

export const LUNCH_RECORD_CREATE_SCHEMA = z
  .object({
    payerId: z.number(),
    consumerIds: z.array(z.number()).nonempty(),
    description: z.string().trim().nonempty(),
    date: z.iso.datetime(),
  })
  .refine(value => !value.consumerIds.includes(value.payerId), {
    error: "consumerIds can't include payerId",
  }) satisfies z.ZodType<LunchRecordCreate>

export const LUNCH_RECORD_SCHEMA = z.object({
  id: z.number(),
  ...LUNCH_RECORD_CREATE_SCHEMA.shape,
}) satisfies z.ZodType<LunchRecord>

export interface LunchRecord {
  id: number
  payerId: number
  consumerIds: number[]
  description: string
  date: string
}

export interface LunchRecordCreate {
  payerId: number
  consumerIds: number[]
  description: string
  date: string
}
