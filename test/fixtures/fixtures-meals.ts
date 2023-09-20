import { expect } from 'vitest'

export const MealsPostSucess = {
  input: {
    name: 'churrasco',
    description: 'churrasco de picanha',
    isInDiet: true,
  },

  expected: {
    reponse: {
      message: 'Refeição criada com sucesso',
    },
    status: 200,
  },
}

export const MealsPostFail = {
  input: {
    name: 'churrasco',
    description: 'churrasco de picanha',
  },

  expected: {
    status: 500,
  },
}

export const MealsGetSucess = {
  expected: expect.objectContaining({
    summary: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        name: 'churrasco', // Specific value
        description: 'churrasco de picanha', // Specific value
        is_in_diet: 1, // Specific value
        created_at: expect.any(String),
        session_id: expect.any(String),
        updated_at: null,
      }),
    ]),
  }),
}

export const MealsGetFails = {
  expected: {
    message: 'Você precisa estar logado para acessar essa rota',
  },
}

export const MealsGetsSummary = {
  expected: expect.objectContaining({
    summaryMeals: expect.objectContaining({
      totalMeals: expect.any(Number),
      totalMealsInDiet: expect.any(Number),
      totalMealsOutDiet: expect.any(Number),
    }),
  }),
}

//   message: 'Você precisa estar logado para acessar essa rota'

export const MealsGetSummaryFail = {
  expected: {
    message: 'Você precisa estar logado para acessar essa rota',
  },
}

//     message: 'Refeição deletada com sucesso',

export const MealsDeleteSucess = {
  expected: {
    message: 'Refeição deletada com sucesso',
  },
}

export const MealsPutSucess = {
  input: {
    name: 'churrasco',
    description: 'churrasco de picanha',
    isInDiet: false,
  },

  expected: {
    reponse: {
      message: 'Refeição atualizada com sucesso',
    },
    status: 200,
  },
}
