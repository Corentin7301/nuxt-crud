import prisma from '~/lib/prisma'
    
    export default defineEventHandler(async (event) => {
      const id = getRouterParam(event, 'id')
      const body = await readBody(event)
    
      try {
        const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) },
          data: body,
        })
        return {
          updated: true,
          data: updatedUser,
        }
      }
      catch (error) {
        console.error('User update error:', error)
        throw error
      }
    })
          