import prisma from '~/lib/prisma'
    
    export default defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')
    
      try {
        await prisma.user.delete({
          where: { id: parseInt(id) },
        })
        return {
          deleted: true,
        }
      }
      catch (error) {
        console.error('User deletion error:', error)
        throw error
      }
    })
          