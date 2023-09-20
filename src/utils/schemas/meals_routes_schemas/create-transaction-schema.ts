import { z } from 'zod'

export const createTransactionSchema = z.object({
  name: z.string(),
  description: z.string(),
  isInDiet: z.boolean(),
})
// qual nome de pasta seria mais clean code? mealsRoutesSchemas ou meals_routes_schemas? mealsRoutesSchemas pois é mais fácil de ler
