import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const res = await prisma.user.create({
      data: body,
    })
    return {
      created: true,
      id: res.id,
    }
  }
  catch (error) {
    console.error('${user} creation error:', error)
    throw error
  }
})
