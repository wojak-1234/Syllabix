
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const series = await prisma.series.findMany({
    where: { teacherId: 'teacher-1' },
    include: {
      _count: {
        select: { lectures: true }
      }
    }
  })
  
  console.log("Series List for teacher-1:")
  series.forEach(s => {
    console.log(`ID: ${s.id}, Title: ${s.title}, Lectures: ${s._count.lectures}`)
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
