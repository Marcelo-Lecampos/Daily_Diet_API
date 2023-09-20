// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/meals' {
  export interface Meals {
    meals: {
      id: string
      name: string
      description: string
      is_in_diet: boolean
      created_at: Date
    }
  }
}
