import knex from 'knex'
import { APP_CONFIG } from '../configuration/app-config.js'
import KNEX_CONFIG from './knexfile.js'

export const DATABASE = knex(KNEX_CONFIG[APP_CONFIG.environment])
