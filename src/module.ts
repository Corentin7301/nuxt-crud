import fs from 'node:fs'
import path from 'node:path'
import { defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit'
import { extractModelsFromSchema } from './runtime/utils/schemaParser'
import { watchSchema } from './runtime/utils/fileWatcher'
import { generateCRUDRoutes } from './runtime/generators/crudRoutes'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-crud',
    configKey: 'nuxtCrud',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const schemaPath = resolver.resolve(nuxt.options.rootDir, 'prisma/schema.prisma')

    const generateCRUD = () => {
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8')
        const models = extractModelsFromSchema(schema)

        models.map((model) => {
          const routes = generateCRUDRoutes(model)
          routes.map((route) => {
            const filePath = path.join(nuxt.options.serverDir, route.handler)
            const dirPath = path.dirname(filePath)

            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true })
            }

            fs.writeFileSync(filePath, route.content)

            addServerHandler({
              route: route.route,
              handler: filePath,
            })
          })
        })
      }
    }

    console.log('[nuxt-crud]: Setting up schema.prisma watcher...')
    generateCRUD()
    console.log('[nuxt-crud]: CRUD generated!')

    if (nuxt.options.dev) {
      // watchSchema(schemaPath, generateCRUD)
    }
  },
})
