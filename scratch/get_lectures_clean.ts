
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const lectures = await prisma.lecture.findMany({
    where: { seriesId: 'mock-파이썬으로-시작하는-자동화의-세계' },
    select: { id: true, title: true, order: true }
  })
  lectures.sort((a, b) => a.order - b.order)
  console.log("Lectures for Python series:")
  lectures.forEach(l => console.log(`${l.order}: ${l.id} - ${l.title}`))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
