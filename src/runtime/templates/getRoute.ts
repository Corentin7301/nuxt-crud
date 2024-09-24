export function getRouteTemplate(model: string): string {
  const lowercaseModel = model.toLowerCase()
  return `import prisma from '~/lib/prisma'
  
  export default defineEventHandler(async (event) => {
    const ${lowercaseModel}Datas = await prisma.${lowercaseModel}.findMany()
    return {
      ...${lowercaseModel}Datas,
    }
  })
  `
}
