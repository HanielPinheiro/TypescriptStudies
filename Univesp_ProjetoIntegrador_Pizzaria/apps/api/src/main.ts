import { app } from './app.js'
import dns from 'node:dns'
import { ensureSchema } from './config/db.js'
import { env } from './config/env.js'
import { seedCatalogIfEmpty } from './modules/catalog/infrastructure/catalogRepository.js'

async function bootstrap(): Promise<void> {
  dns.setDefaultResultOrder('ipv4first')
  await ensureSchema()
  await seedCatalogIfEmpty()

  app.listen(env.PORT, () => {
    console.log(`API rodando em http://localhost:${env.PORT}`)
  })
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
