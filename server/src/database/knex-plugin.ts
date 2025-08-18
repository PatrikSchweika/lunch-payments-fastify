import knex from 'knex'
import KnexConfig from './knexfile.js'
import { APP_CONFIG } from '../configuration/app-config.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fp from 'fastify-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const knexPlugin = fp(async fastify => {
  const db = knex(KnexConfig[APP_CONFIG.environment])

  await db.migrate.latest({ directory: path.join(__dirname, 'migrations') })

  fastify.decorate('knex', db)
})
