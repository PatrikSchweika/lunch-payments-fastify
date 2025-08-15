import { z } from 'zod/v4'

export interface ApiErrorMessage {
  message: string
}

export interface ApiValidationErrorMessage extends ApiErrorMessage {
  statusCode: number
  code: string
  error: string
}

export const API_ERROR_MESSAGE_SCHEMA = z.object({
  message: z.string().nonempty(),
}) satisfies z.ZodType<ApiErrorMessage>

export const API_VALIDATION_ERROR_MESSAGE_SCHEMA = z.object({
  ...API_ERROR_MESSAGE_SCHEMA.shape,
  statusCode: z.number().min(400).max(599),
  code: z.string().nonempty(),
  error: z.string().nonempty(),
}) satisfies z.ZodType<ApiValidationErrorMessage>
