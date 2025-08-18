import knex from 'knex'
import KnexConfig from './knexfile.js'
import fp from 'fastify-plugin'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

export const knexPlugin = fp(async fastify => {
  const db = knex(KnexConfig[fastify.appConfig.environment])

  // await db.migrate.latest({ directory: path.join(__dirname, 'migrations') })

  fastify.decorate('knex', db)
})
