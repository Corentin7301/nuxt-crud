import prisma from '~/lib/prisma'
  
  export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
  
    try {
      const updatedPost = await prisma.post.update({
        where: { id: Number.parseInt(id) },
        data: body,
      })
      return {
        updated: true,
        data: updatedPost,
      }
    }
    catch (error) {
      console.error('Post update error:', error)
      throw error
    }
  })
  