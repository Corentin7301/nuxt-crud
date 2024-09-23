import fs from 'node:fs'
import { watch } from 'node:fs/promises'
import path from 'node:path'
import { defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit'
import type { NitroEventHandler } from 'nitropack'

interface CRUDRoute extends NitroEventHandler {
  content: string
}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-crud',
    configKey: 'nuxtCrud',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const schemaPath = resolver.resolve(
      nuxt.options.rootDir,
      'prisma/schema.prisma',
    )

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
              route: `${route.route}`,
              handler: filePath,
            })
          })
        })
      }
    }

    console.log('[nuxt-crud]: Setting up schema.prisma watcher...')
    generateCRUD()
    console.log('[nuxt-crud]: CRUD generated!')

    // if (nuxt.options.dev) {
    //   nuxt.hook('ready', async () => {
    //     console.log('Setting up schema.prisma watcher...')
    //     try {
    //       const watcher = watch(schemaPath)
    //       for await (const event of watcher) {
    //         if (event.eventType === 'change') {
    //           console.log('schema.prisma changed, regenerating CRUD...')
    //           generateCRUD()
    //         }
    //       }
    //     }
    //     catch (error) {
    //       console.error('Error watching schema.prisma:', error)
    //     }
    //   })
    // }

    function extractModelsFromSchema(schema: string): string[] {
      const models: string[] = []
      const lines = schema.split('\n')
      let isInComment = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line.includes('/*')) isInComment = true
        if (line.includes('*/')) {
          isInComment = false
          continue
        }
        if (isInComment) continue

        if (line.startsWith('//')) continue

        const modelMatch = line.match(/^model\s+(\w+)\s*\{/)
        if (modelMatch) {
          models.push(modelMatch[1])
        }
      }

      return models
    }

    function generateCRUDRoutes(model: string): CRUDRoute[] {
      const lowercaseModel = model.toLowerCase()
      return [
        {
          route: `/api/${lowercaseModel}/index.get`,
          handler: `api/${lowercaseModel}/index.get.ts`,
          method: 'get',
          content: `import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const ${lowercaseModel}Datas = await prisma.${lowercaseModel}.findMany()
  return {
    ...${lowercaseModel}Datas,
  }
})

          `,
        },
        {
          route: `/api/${lowercaseModel}/index.post`,
          handler: `api/${lowercaseModel}/index.post.ts`,
          method: 'post',
          content: `import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const ${lowercaseModel}Datas = await prisma.${lowercaseModel}.create({
      data: body,
    })
    return {
      created: true,
      id: ${lowercaseModel}Datas.id,
    }
  }
  catch (error) {
    console.error('${lowercaseModel} creation error:', error)
    throw error
  }
})
          `,
        },
        {
          route: `/api/${lowercaseModel}/[id].patch`,
          handler: `api/${lowercaseModel}/[id].patch.ts`,
          method: 'patch',
          content: `import prisma from '~/lib/prisma'
    
    export default defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')
      const body = await readBody(event)
    
      try {
        const updated${model} = await prisma.${lowercaseModel}.update({
          where: { id: parseInt(id) },
          data: body,
        })
        return {
          updated: true,
          data: updated${model},
        }
      }
      catch (error) {
        console.error('${model} update error:', error)
        throw error
      }
    })
          `,
        },
        {
          route: `/api/${lowercaseModel}/[id].delete`,
          handler: `api/${lowercaseModel}/[id].delete.ts`,
          method: 'delete',
          content: `import prisma from '~/lib/prisma'
    
    export default defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')
    
      try {
        await prisma.${lowercaseModel}.delete({
          where: { id: parseInt(id) },
        })
        return {
          deleted: true,
        }
      }
      catch (error) {
        console.error('${model} deletion error:', error)
        throw error
      }
    })
          `,
        },
      ]
    }
  },
})
