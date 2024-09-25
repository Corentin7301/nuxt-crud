import fs from 'node:fs'
import path from 'node:path'
import { extractModelsFromSchema } from './runtime/utils/schemaParser.js'

export default function (plop) {
  const apiPath = process.env.NUXT_API_PATH
  const schemaPath = process.env.NUXT_SCHEMA_PATH

  plop.setGenerator('crud', {
    description: 'Generate CRUD operations for Prisma models',
    prompts: [],
    actions: () => {
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
      const models = extractModelsFromSchema(schemaContent)
      const actions = []

      models.map((model) => {
        const lowercaseModel = model.toLowerCase()
        const modelPath = path.join(apiPath, lowercaseModel)

        const existingFiles = ['get', 'post', 'patch', 'delete'].some(method =>
          fs.existsSync(path.join(modelPath, `${method === 'get' || method === 'post' ? 'index' : '[id]'}.${method}.ts`)),
        )

        if (!existingFiles) {
          ['get', 'post', 'patch', 'delete'].map((method) => {
            actions.push({
              type: 'add',
              path: path.join(modelPath, `${method === 'get' || method === 'post' ? 'index' : '[id]'}.${method}.ts`),
              templateFile: `runtime/templates/${method}.hbs`,
              data: { model, lowercaseModel },
              skipIfExists: true,
            })
          })
          console.log('CRUD generated successfully!')
        }
        else {
          console.log('CRUD is always generated!')
        }
      })

      return actions
    },
  })
}
