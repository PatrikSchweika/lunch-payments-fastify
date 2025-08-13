import { z } from 'zod/v4'

export interface LunchRecord {
  id: number
  payerId: number
  consumerIds: number[]
  description: string
  date: string
}

export const LUNCH_RECORD_CREATE_SCHEMA = z.object({
  payerId: z.number(),
  consumerIds: z.array(z.number()),
  description: z.string().trim().nonempty(),
  date: z.iso.datetime(),
})

export interface LunchRecordCreate {
  payerId: number
  consumerIds: number[]
  description: string
  date: string
}
