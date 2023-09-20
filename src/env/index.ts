import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333), // coerce converte o valor para o tipo especificado, caso seja possível. Se não for possível, o valor default é usado.
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env) // safeParse is a method from zod que retorna um objeto com as propriedades data, error e success.

if (!_env.success) {
  console.error('🔥 Deu ruim no env')
  throw new Error(_env.error.message)
}

export const env = _env.data // data é a propriedade que contém o .env com as propriedades que definimos no envSchema.

// Agora usaremos o env no lugar do .env nos arquivos que precisam de acesso às variáveis de ambiente.
