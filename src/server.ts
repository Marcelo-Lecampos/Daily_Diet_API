import { env } from './env'
import { app } from './app'

app.listen({ port: Number(env.PORT) }, (err, address) => {
  if (err) throw err
  app.log.info(`server listening on ${address}`)

  console.log(`📞 Hello from the server listening on ${address}`)
})
