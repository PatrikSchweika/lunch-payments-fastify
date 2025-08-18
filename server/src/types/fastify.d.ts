import { Knex } from 'knex'
import { AuthUser } from 'contracts'

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser
  }
  interface FastifyInstance {
    knex: Knex
  }
}
