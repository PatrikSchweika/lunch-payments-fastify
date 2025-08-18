import type { Knex } from 'knex'
import path from 'node:path'

interface KnexConfig {
  development: Knex.Config
  production: Knex.Config
}

const config: KnexConfig = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(import.meta.dirname, '../../development.sqlite'),
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
      filename: path.resolve(import.meta.dirname, '../../production.sqlite'),
      timezone: 'utc',
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    useNullAsDefault: true,
  },
}

export default config
