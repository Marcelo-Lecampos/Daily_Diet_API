import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process' // usado para executar comandos no terminal nos testes
import {
  MealsDeleteSucess,
  MealsGetFails,
  MealsGetSucess,
  MealsGetSummaryFail,
  MealsGetsSummary,
  MealsPostFail,
  MealsPostSucess,
  MealsPutSucess,
} from './fixtures/fixtures-meals'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all') // reseta o banco de dados antes de cada teste
    execSync('npm run knex migrate:latest') // executa as migrations antes de cada teste
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Post /meals', () => {
    it('Post --dado o input com dados da refeição -- deve registrar a refeição no DB e logar o user', async () => {
      const su = await request(app.server)
      const { expected, input } = MealsPostSucess
      const response = await su.post('/meals').send(input)

      expect(response.body).toEqual(expected.reponse)
      expect(response.status).toEqual(expected.status)
    })

    it('Post --dado o input com dados da refeição incompletos -- deve retornar uma msg de error', async () => {
      const su = await request(app.server)
      const { expected, input } = MealsPostFail
      const response = await su.post('/meals').send(input)

      expect(response.status).toEqual(expected.status)
    })
  })

  describe('Get /meals', () => {
    it('Get -- deve retornar todas as refeições do usuário logado', async () => {
      const postMeals = await request(app.server)
      const { input } = MealsPostSucess
      const postResponse = await postMeals.post('/meals').send(input)
      const cookies = postResponse.get('Set-Cookie')

      const su = await request(app.server)
      const getResponse = await su
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      const { expected } = MealsGetSucess
      expect(getResponse.body).toEqual(expected)
    }) // Get

    it('Get -- dado que o usuário não está logado -- deve retornar uma msg de error', async () => {
      const su = await request(app.server)
      const getResponse = await su.get('/meals').expect(401)

      const { expected } = MealsGetFails

      expect(getResponse.body).toEqual(expected)
    })
  })

  describe('Get/summary', async () => {
    it('Get/summary -- -- deve retornar um resumo das refeições do usuário em formado de array', async () => {
      const postMeals = await request(app.server)
      const { input } = MealsPostSucess
      const postResponse = await postMeals.post('/meals').send(input)
      const cookies = postResponse.get('Set-Cookie')

      const { expected } = MealsGetsSummary
      const su = await request(app.server)
      const getResponse = await su
        .get('/meals/summary')
        .set('Cookie', cookies)
        .expect(200)

      expect(getResponse.body).toEqual(expected)
    })

    it('Get/summary -- dado que o usuário não está logado -- deve retornar uma msg de error', async () => {
      const su = await request(app.server)
      const getResponse = await su.get('/meals/summary').expect(401)

      const { expected } = MealsGetSummaryFail

      expect(getResponse.body).toEqual(expected)
    })
  })

  describe('Delete /meals', () => {
    it('Delete -- dado o id de uma refeição -- deve deletar a refeição do DB', async () => {
      const postMeals = await request(app.server)
      const { input } = MealsPostSucess
      const postResponse = await postMeals.post('/meals').send(input)
      const cookies = postResponse.get('Set-Cookie')

      const su = await request(app.server)
      const getResponse = await su
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      const { id } = getResponse.body.summary[0]
      const deleteResponse = await su
        .delete(`/meals/${id}`)
        .set('Cookie', cookies)
        .expect(200)

      const { expected } = MealsDeleteSucess

      expect(deleteResponse.body).toEqual(expected)
    })
  })
  describe('Put /meals', () => {
    it('Put -- dado o id de uma refeição -- deve atualizar a refeição no DB', async () => {
      const postMeals = await request(app.server)
      const postResponse = await postMeals
        .post('/meals')
        .send(MealsPostSucess.input)
      const cookies = postResponse.get('Set-Cookie')

      const su = await request(app.server)
      const getResponse = await su
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      const { id } = getResponse.body.summary[0]

      const { input, expected } = MealsPutSucess

      const putResponse = await su
        .put(`/meals/${id}`)
        .set('Cookie', cookies)
        .send(input)
        .expect(200)

      expect(putResponse.body).toEqual(expected)
    })
  })
})
