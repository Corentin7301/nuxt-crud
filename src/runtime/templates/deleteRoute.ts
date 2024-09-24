export function deleteRouteTemplate(model: string): string {
  const lowercaseModel = model.toLowerCase()
  return `import prisma from '~/lib/prisma'
  
  export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
  
    try {
      await prisma.${lowercaseModel}.delete({
        where: { id: Number.parseInt(id) },
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
  `
}
