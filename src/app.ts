import fastify from 'fastify'
import cookie from '@fastify/cookie'
// import fastifyCookie from '@fastify/cookie' o fastifyCookie é um nome que eu dei para o pacote, poderia ser qualquer outro

import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookie)
app.register(mealsRoutes, { prefix: '/meals' }) // meals vira a rota de mealsRoutes
