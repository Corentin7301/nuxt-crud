import { execSync } from 'node:child_process'
import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-crud',
    configKey: 'nuxtCrud',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const schemaPath = resolver.resolve(nuxt.options.rootDir, 'prisma/schema.prisma')
    const apiPath = resolver.resolve(nuxt.options.rootDir, 'server/api')

    const generateCRUD = () => {
      try {
        const plopfilePath = resolver.resolve('./plopfile.mjs')
        execSync(`plop --plopfile ${plopfilePath}`, {
          stdio: 'inherit',
          env: {
            ...process.env,
            NUXT_API_PATH: apiPath,
            NUXT_SCHEMA_PATH: schemaPath,
          },
        })
      }
      catch (error) {
        console.error('Error generating CRUD:', error)
      }
    }

    nuxt.hook('ready', () => {
      generateCRUD()
    })
  },
})
