import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lunchRecords', table => {
    table.increments('id').primary().unsigned()

    table.string('description').notNullable()

    table.date('date').notNullable()

    table.integer('payerId').index().unsigned().notNullable()

    table.foreign('payerId').references('id').inTable('users')

    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('lunchConsumers', table => {
    table.increments('id').primary().unsigned()

    table.integer('lunchRecordId').index().unsigned().notNullable()

    table
      .foreign('lunchRecordId')
      .references('id')
      .inTable('lunchRecords')
      .onDelete('CASCADE')

    table.integer('consumerId').index().unsigned().notNullable()

    table
      .foreign('consumerId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    table.unique(['lunchRecordId', 'consumerId'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lunchRecords')
  await knex.schema.dropTable('lunchConsumers')
}
