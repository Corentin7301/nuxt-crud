export function postRouteTemplate(model: string): string {
  const lowercaseModel = model.toLowerCase()
  return `import prisma from '~/lib/prisma'
  
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
  `
}
