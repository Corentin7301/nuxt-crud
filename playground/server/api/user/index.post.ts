import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const userDatas = await prisma.user.create({
      data: body,
    })
    return {
      created: true,
      id: userDatas.id,
    }
  }
  catch (error) {
    console.error('user creation error:', error)
    throw error
  }
})
