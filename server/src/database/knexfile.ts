import type { Knex } from 'knex'
import { APP_CONFIG } from '../configuration/app-config.js'

interface KnexConfig {
	development: Knex.Config
	production: Knex.Config
}

const config: KnexConfig = {
	development: {
		client: 'pg',
		connection: {
			connectionString: APP_CONFIG.pgConnectionString,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
	},

	production: {
		client: 'pg',
		connection: {
			connectionString: APP_CONFIG.pgConnectionString,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
	},
}

export default config
