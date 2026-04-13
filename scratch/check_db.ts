import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: 'user-1' }, { role: 'STUDENT' }] }
  })
  
  if (user) {
    console.log("FOUND STUDENT USER:", user.id, user.role)
  } else {
    console.log("NO STUDENT USER FOUND")
  }

  const series = await prisma.series.findMany({ where: { status: 'PUBLISHED' } })
  console.log("PUBLISHED SERIES COUNT:", series.length)
}

main().finally(() => prisma.$disconnect())
