import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding base users...")
  
  // Create Student user-1
  const student = await prisma.user.upsert({
    where: { id: 'user-1' },
    update: {},
    create: {
      id: 'user-1',
      email: 'student@syllabix.com',
      name: '데모 학생',
      role: 'STUDENT',
      studentLevel: 'Beginner'
    }
  })
  console.log("Upserted Student:", student.id)

  // Create Teacher teacher-1
  const teacher = await prisma.user.upsert({
    where: { id: 'teacher-1' },
    update: {},
    create: {
      id: 'teacher-1',
      email: 'teacher1@syllabix.com',
      name: '홍길동 강사',
      role: 'TEACHER'
    }
  })
  console.log("Upserted Teacher:", teacher.id)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
