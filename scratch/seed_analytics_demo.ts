import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. 대상 강좌(Series) 조회
  const series = await prisma.series.findFirst({
    where: { status: 'PUBLISHED' },
    include: { lectures: { orderBy: { order: 'asc' } } }
  })

  if (!series) {
    console.log("Error: No PUBLISHED series found. Create one first.")
    return
  }

  console.log(`Found series: ${series.title} (${series.id})`)
  
  // 2. 가상 유저(학생) 생성
  const studentNames = ["김철수", "이영희", "박민수", "최수지", "정우성"]
  const students = []
  
  for (const name of studentNames) {
    const email = `${Math.random().toString(36).substring(7)}@demo.com`
    const student = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        role: 'STUDENT',
        studentLevel: 'Beginner'
      }
    })
    students.push(student)
    
    // 강좌 등록(Enrollment)
    await prisma.enrollment.upsert({
      where: { studentId_seriesId: { studentId: student.id, seriesId: series.id } },
      update: {},
      create: {
        studentId: student.id,
        seriesId: series.id,
        progress: 0.3,
        completedLectureIds: JSON.stringify([])
      }
    })
  }

  // 3. 강의 오답 및 제출 내역 생성 (데모용)
  // Python 스코프 관련 오답들을 집중적으로 생성하여 AI가 발견하게 함
  const scopeLecture = series.lectures.find(l => l.title.includes('함수') || l.title.includes('Scope')) || series.lectures[0]
  
  for (const student of students) {
    // 3회 실패 제출 (Submission) - Scoping Error 위주
    await prisma.submission.create({
      data: {
        studentId: student.id,
        lectureId: scopeLecture.id,
        attemptNumber: 1,
        code: "def update_val():\n  val = val + 1\nupdate_val()",
        passed: false,
        errorType: "UnboundLocalError",
        errorMessage: "local variable 'val' referenced before assignment",
        dynamicQuestionTitle: "함수 내부 변수 수정하기",
        aiHint: "함수 내부에서 외부 변수를 수정하려면 어떤 키워드가 필요할까요?"
      }
    })

    // 오답노트 (ErrorNote)
    await prisma.errorNote.create({
      data: {
        studentId: student.id,
        lectureId: scopeLecture.id,
        problemTitle: "함수 내부 변수 수정하기",
        errorType: "Scoping Issue",
        wrongReason: "지역 변수와 전역 변수의 범위를 이해하지 못함",
        relatedConcept: "Python Scope (global)",
        attemptCount: 3
      }
    })
  }

  console.log("Successfully seeded mock analytics data for '" + series.title + "'")
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
