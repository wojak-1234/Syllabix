
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const series = await prisma.series.findMany({
    where: { teacherId: 'teacher-1' },
    include: {
      lectures: true
    }
  })
  
  series.forEach(s => {
    console.log(`Series: ${s.title} (${s.id})`)
    s.lectures.forEach(l => {
      console.log(`  Lecture ${l.order}: ${l.title} (${l.id})`)
    })
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
