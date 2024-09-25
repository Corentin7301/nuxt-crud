import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const postDatas = await prisma.post.create({
      data: body,
    })
    return {
      created: true,
      id: postDatas.id,
    }
  }
  catch (error) {
    console.error('post creation error:', error)
    throw error
  }
})
