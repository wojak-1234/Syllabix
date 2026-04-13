import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.series.count({ where: { status: 'PUBLISHED' } })
  console.log(`Published series count: ${count}`)
  
  const all = await prisma.series.findMany({ 
    where: { status: 'PUBLISHED' },
    select: { id: true, title: true, status: true }
  })
  console.log("Published Series:", JSON.stringify(all, null, 2))
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
