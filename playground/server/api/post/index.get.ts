import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const postDatas = await prisma.post.findMany()
  return {
    ...postDatas,
  }
})
