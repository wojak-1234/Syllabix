
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const students = ['student-2', 'student-3', 'student-4']
  
  const series = await prisma.series.findMany({
    where: { teacherId: 'teacher-1' },
    include: { lectures: true }
  })

  console.log("Seeding massive submissions and error notes...")

  const errors = [
    { type: 'TypeError', msg: 'cannot read property of undefined', reason: '데이터가 돌아오기 전에 접근하려 함', concept: 'Async Logic' },
    { type: 'SyntaxError', msg: 'unexpected token', reason: '기본 문법 오타 및 괄호 불일치', concept: 'Basic Syntax' },
    { type: 'RangeError', msg: 'Maximum call stack size exceeded', reason: '재귀 함수의 탈출 조건을 잘못 설정함', concept: 'Recursion' },
    { type: 'LogicError', msg: 'Incorrect Result', reason: '반복문의 인덱스 범위를 잘못 지정함 (Off-by-one error)', concept: 'Loop Boundary' },
    { type: 'ReferenceError', msg: 'x is not defined', reason: '변수 스코프에 대한 이해 부족', concept: 'Variable Scope' }
  ]

  for (const s of series) {
    console.log(`Processing Series: ${s.title}`)
    for (const l of s.lectures) {
      for (const studentId of students) {
        // 70% chance of passing on 1st attempt
        const p1 = Math.random() > 0.3
        
        if (p1) {
            await prisma.submission.create({
                data: {
                    studentId,
                    lectureId: l.id,
                    code: "// Correct solution\nconsole.log('Passed!')",
                    passed: true,
                    attemptNumber: 1,
                    dynamicQuestionTitle: `${l.title} 퀴즈`
                }
            })
        } else {
            // Failed 1st attempt
            const error = errors[Math.floor(Math.random() * errors.length)]
            await prisma.submission.create({
                data: {
                    studentId,
                    lectureId: l.id,
                    code: "// Broken code\nfunction test() { ??? }",
                    passed: false,
                    attemptNumber: 1,
                    errorType: error.type,
                    errorMessage: error.msg,
                    dynamicQuestionTitle: `${l.title} 퀴즈`
                }
            })

            // 50% chance of failing 2nd attempt too
            if (Math.random() > 0.5) {
                await prisma.submission.create({
                    data: {
                        studentId,
                        lectureId: l.id,
                        code: "// Still broken code",
                        passed: false,
                        attemptNumber: 2,
                        errorType: error.type,
                        errorMessage: error.msg,
                        dynamicQuestionTitle: `${l.title} 퀴즈`
                    }
                })

                // Create ErrorNote if failed multiple times
                await prisma.errorNote.upsert({
                    where: { id: `en-${l.id}-${studentId}` }, // Dummy ID for upsert-safe seeding
                    update: {},
                    create: {
                        id: `en-${l.id}-${studentId}`,
                        studentId,
                        lectureId: l.id,
                        problemTitle: `${l.title} 퀴즈`,
                        errorType: error.type,
                        wrongReason: error.reason,
                        relatedConcept: error.concept,
                        attemptCount: 2
                    }
                })
            } else {
                // Passed on 2nd attempt
                await prisma.submission.create({
                    data: {
                        studentId,
                        lectureId: l.id,
                        code: "// Fixed code",
                        passed: true,
                        attemptNumber: 2,
                        dynamicQuestionTitle: `${l.title} 퀴즈`
                    }
                })
            }
        }
      }
    }
  }

  console.log("Massive seeding completed!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
