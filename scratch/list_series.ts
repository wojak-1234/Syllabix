import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const series = await prisma.series.findMany({
    select: {
      id: true,
      title: true,
      targetLevel: true,
      status: true
    }
  })
  
  console.log("=== DB에 저장된 강좌 목록 ===")
  series.forEach((s, i) => {
    console.log(`[${i+1}] ${s.title} (Level: ${s.targetLevel}, Status: ${s.status}) - ID: ${s.id}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
