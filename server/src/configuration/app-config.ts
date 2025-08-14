import dotenv from 'dotenv'
import { z } from 'zod/v4'

dotenv.config()

export enum Environment {
  Development = 'development',
  Production = 'production',
}

interface AppConfig {
  readonly environment: Environment
  readonly port: number
}

const ENV_SCHEMA = z.object({
  NODE_ENV: z.enum(Environment).default(Environment.Development),
  PORT: z.coerce.number().default(3000),
})

const env = ENV_SCHEMA.safeParse(process.env)

if (!env.success) {
  console.error('Invalid env variables')
  console.error(env.error!.message)
  process.exit(1)
}

export const APP_CONFIG: AppConfig = {
  environment: env.data.NODE_ENV,
  port: env.data.PORT,
} as const
