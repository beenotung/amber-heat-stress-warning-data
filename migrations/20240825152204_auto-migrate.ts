import { Knex } from 'knex'

// prettier-ignore
export async function up(knex: Knex): Promise<void> {
  await knex.raw('alter table `notice` add column `start_no` integer not null')
  await knex.raw('alter table `notice` add column `end_no` integer null')
}

// prettier-ignore
export async function down(knex: Knex): Promise<void> {
  await knex.raw('alter table `notice` drop column `end_no`')
  await knex.raw('alter table `notice` drop column `start_no`')
}
