import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('notice_date'))) {
    await knex.schema.createTable('notice_date', table => {
      table.increments('id')
      table.text('date').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('notice'))) {
    await knex.schema.createTable('notice', table => {
      table.increments('id')
      table.enum('type', ['amber']).notNullable()
      table.text('start_time').notNullable()
      table.text('end_time').nullable()
      table.timestamps(false, true)
    })
  }
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notice')
  await knex.schema.dropTableIfExists('notice_date')
}
