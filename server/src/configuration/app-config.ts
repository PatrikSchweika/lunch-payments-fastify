import dotenv from 'dotenv'
import { z } from 'zod/v4'
import { AuthUserRole } from 'contracts/src/models/auth-user.js'

dotenv.config()

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export interface AuthUserConfig {
  readonly username: string
  readonly password: string
  readonly role: AuthUserRole
}

export interface AppConfig {
  readonly environment: Environment
  readonly port: number
  readonly user: AuthUserConfig
  readonly admin: AuthUserConfig
}

const ENV_SCHEMA = z.object({
  NODE_ENV: z.enum(Environment).default(Environment.Development),
  PORT: z.coerce.number().default(3000),
  USER_USERNAME: z.string().nonempty(),
  USER_PASSWORD: z.string().nonempty(),
  ADMIN_USERNAME: z.string().nonempty(),
  ADMIN_PASSWORD: z.string().nonempty(),
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
  user: {
    username: env.data.USER_USERNAME,
    password: env.data.USER_PASSWORD,
    role: AuthUserRole.User,
  },
  admin: {
    username: env.data.ADMIN_USERNAME,
    password: env.data.ADMIN_PASSWORD,
    role: AuthUserRole.Admin,
  },
} as const
