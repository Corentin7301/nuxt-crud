import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const userDatas = await prisma.user.findMany()
  return {
    ...userDatas,
  }
})
