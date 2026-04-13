import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const lectures = await prisma.lecture.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
        series: { select: { title: true } }
    }
  })
  
  if (lectures.length === 0) {
      console.log("NO LECTURES FOUND")
  } else {
      console.log(JSON.stringify(lectures, null, 2))
  }
}

main().finally(() => prisma.$disconnect())
