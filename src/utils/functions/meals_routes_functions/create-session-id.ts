import { randomUUID } from 'crypto'
import { FastifyReply } from 'fastify'

interface CreateSessionId {
  (sessionId: string | undefined, response: FastifyReply): string
}
export const createSessionId: CreateSessionId = (sessionId, response) => {
  if (!sessionId) {
    sessionId = randomUUID()

    response.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    })
  }
  return sessionId
}
