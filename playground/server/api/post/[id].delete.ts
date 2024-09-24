import prisma from '~/lib/prisma'
  
  export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
  
    try {
      await prisma.post.delete({
        where: { id: Number.parseInt(id) },
      })
      return {
        deleted: true,
      }
    }
    catch (error) {
      console.error('Post deletion error:', error)
      throw error
    }
  })
  