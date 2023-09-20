import { FastifyInstance } from 'fastify'
import { createSessionId } from '../utils/functions/meals_routes_functions/create-session-id'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { createTransactionSchema } from '../utils/schemas/meals_routes_schemas/create-transaction-schema'
import { checkSessionIdExist } from '../middlewares/check-session-id-exists'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    let sessionId = request.cookies.sessionId
    sessionId = createSessionId(sessionId, response)

    const { name, description, isInDiet } = createTransactionSchema.parse(
      request.body,
    )

    const insertResult = await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_in_diet: isInDiet,
      session_id: sessionId,
    })

    if (!insertResult) {
      return response.status(500).send({ message: 'Erro ao criar refeição' })
    }

    response.send({ message: 'Refeição criada com sucesso' }).status(201)
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, response) => {
      const sessionId = request.cookies.sessionId

      const summary = await knex('meals')
        .where('session_id', sessionId)
        .select()

      if (!summary) {
        return response
          .status(500)
          .send({ message: 'Erro ao buscar refeições' })
      }

      if (summary.length === 0) {
        return response
          .status(404)
          .send({ message: 'Nenhuma refeição encontrada' })
      }

      response.send({ summary })
    },
  )

  // criar endpoint delete que receba o id da refeição e a apague do db
  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, response) => {
      const sessionId = request.cookies.sessionId

      const idSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = idSchema.parse(request.params)

      const deleteResult = await knex('meals')
        .where('session_id', sessionId)
        .andWhere('id', id)
        .delete()

      if (!deleteResult) {
        return response
          .status(500)
          .send({ message: 'Erro ao deletar refeição' })
      }

      response.send({ message: 'Refeição deletada com sucesso' })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, response) => {
      const sessionId = request.cookies.sessionId

      const idSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = idSchema.parse(request.params)

      const { name, description, isInDiet } = createTransactionSchema.parse(
        request.body,
      )

      const now = new Date()
      const updateResult = await knex('meals')
        .where('session_id', sessionId)
        .andWhere('id', id)
        .update({
          name,
          description,
          is_in_diet: isInDiet,
          updated_at: now.toISOString().replace('T', ' ').split('.')[0],
        })

      if (!updateResult) {
        return response
          .status(500)
          .send({ message: 'Erro ao atualizar refeição' })
      }

      response.send({ message: 'Refeição atualizada com sucesso' })
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, response) => {
      let sessionId = request.cookies.sessionId
      sessionId = createSessionId(sessionId, response)

      const summary = await knex('meals')
        .where('session_id', sessionId)
        .select()

      if (!summary) {
        response.status(500).send({ message: 'Erro ao buscar refeições' })
        return
      }

      if (summary.length === 0) {
        response.status(404).send({ message: 'Nenhuma refeição encontrada' })
        return
      }

      const totalMeals = summary.length
      const totalMealsInDiet = summary.filter((meal) => meal.is_in_diet).length
      const totalMealsOutDiet = summary.filter(
        (meal) => !meal.is_in_diet,
      ).length

      const summaryMeals = {
        totalMeals,
        totalMealsInDiet,
        totalMealsOutDiet,
      }

      response.send({ summaryMeals })
    }, // async
  )
}
