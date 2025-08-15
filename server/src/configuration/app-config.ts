import dotenv from 'dotenv'
import { z } from 'zod/v4'

dotenv.config()

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export interface AuthUser {
  readonly username: string
  readonly password: string
  readonly role: UserRole
}

export interface AppConfig {
  readonly environment: Environment
  readonly port: number
  readonly user: AuthUser
  readonly admin: AuthUser
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
    role: UserRole.User,
  },
  admin: {
    username: env.data.ADMIN_USERNAME,
    password: env.data.ADMIN_PASSWORD,
    role: UserRole.Admin,
  },
} as const
