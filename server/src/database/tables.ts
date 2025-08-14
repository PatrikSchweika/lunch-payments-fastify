import { LunchConsumerDb } from './models/lunch-consumer.js'
import { LunchRecordDb } from './models/lunch-record.js'
import { UserDb } from './models/user.js'

declare module 'knex/types/tables.js' {
  interface Tables {
    users: UserDb
    lunchRecords: LunchRecordDb
    lunchConsumers: LunchConsumerDb
  }
}
