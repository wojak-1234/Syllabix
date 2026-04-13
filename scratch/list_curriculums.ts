import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const curriculums = await prisma.curriculum.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
        student: { select: { name: true, email: true } }
    }
  })
  
  console.log(JSON.stringify(curriculums, null, 2))
}

main().finally(() => prisma.$disconnect())
