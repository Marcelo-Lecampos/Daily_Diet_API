import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // adicionar coluna session_id na tabela meals
  await knex.schema.alterTable('meals', (table) => {
    table.string('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('session_id')
  })
}
