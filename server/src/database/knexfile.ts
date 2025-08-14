import type { Knex } from 'knex'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface KnexConfig {
  development: Knex.Config
  production: Knex.Config
}

const config: KnexConfig = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, '../../development.sqlite'),
      timezone: 'utc',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, '../../production.sqlite'),
      timezone: 'utc',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    useNullAsDefault: true,
  },
}

export default config
