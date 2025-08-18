import { Knex } from 'knex'
import { AuthUser } from 'contracts'
import { AppConfig } from '../configuration/app-config.js'

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser
  }
  interface FastifyInstance {
    knex: Knex
    appConfig: AppConfig
  }
}
