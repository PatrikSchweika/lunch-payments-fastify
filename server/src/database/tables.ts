import { User } from 'contracts/src/models/user.js'

declare module 'knex/types/tables.js' {
  interface Tables {
    users: User
  }
}
