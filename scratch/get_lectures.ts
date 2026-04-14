
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const lectures = await prisma.lecture.findMany({
    where: { seriesId: 'mock-파이썬으로-시작하는-자동화의-세계' }
  })
  console.log(JSON.stringify(lectures, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
