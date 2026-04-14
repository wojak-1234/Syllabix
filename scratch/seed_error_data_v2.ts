
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const students = ['student-2', 'student-3', 'student-4']
  const seriesId = 'mock-파이썬으로-시작하는-자동화의-세계'
  
  const lectures = [
    { id: 'cmnxbtx530001pzhqjeu7eejs', title: '파이썬 설치 및 환경 설정' },
    { id: 'cmnxbtxeq0003pzhqpgb95mbx', title: '변수와 데이터 타입' },
    { id: 'cmnxbtxkq0005pzhq5ckjf34n', title: '엑셀 자동화 첫걸음 (openpyxl)' },
    { id: 'cmnxbtxqp0007pzhqg0c4fcc8', title: '이메일 대량 발송 스크립트' }
  ]

  console.log("Seeding submissions and error notes...")

  for (const studentId of students) {
    // Lecture 1: All passed
    await prisma.submission.create({
      data: {
        studentId,
        lectureId: lectures[0].id,
        code: "print('Python Ready!')",
        passed: true,
        attemptNumber: 1,
        dynamicQuestionTitle: "환경 설정 확인"
      }
    })

    // Lecture 2: Variable failure for student-3 and student-4
    if (studentId === 'student-3' || studentId === 'student-4') {
      await prisma.submission.createMany({
        data: [
          {
            studentId,
            lectureId: lectures[1].id,
            code: "x = '1'; y = 2; print(x + y)",
            passed: false,
            attemptNumber: 1,
            errorType: 'TypeError',
            errorMessage: 'can only concatenate str (not "int") to str',
            dynamicQuestionTitle: "타입 변환 연습"
          }
        ]
      })

      // Create ErrorNote
      await prisma.errorNote.create({
        data: {
          studentId,
          lectureId: lectures[1].id,
          problemTitle: "타입 변환 연습",
          errorType: 'TypeError',
          wrongReason: "문자열과 숫자의 더하기 연산 시 자동 형변환이 되지 않는 점을 인지하지 못함.",
          relatedConcept: "Dynamic Typing and Type Conversion",
          attemptCount: 1
        }
      })
    } else {
       await prisma.submission.create({
        data: {
          studentId,
          lectureId: lectures[1].id,
          code: "x = 1; y = 2; print(x + y)",
          passed: true,
          attemptNumber: 1,
          dynamicQuestionTitle: "기본 연산"
        }
      })
    }

    // Lecture 3: Excel - student-2 failed
    if (studentId === 'student-2') {
        await prisma.submission.createMany({
            data: [
                {
                    studentId,
                    lectureId: lectures[2].id,
                    code: "wb = openpyxl.load_workbook('none.xlsx')",
                    passed: false,
                    attemptNumber: 1,
                    errorType: 'FileNotFoundError',
                    errorMessage: "[Errno 2] No such file or directory: 'none.xlsx'",
                    dynamicQuestionTitle: "엑셀 파일 열기"
                }
            ]
        })
        await prisma.errorNote.create({
            data: {
                studentId,
                lectureId: lectures[2].id,
                problemTitle: "엑셀 파일 열기",
                errorType: 'FileNotFoundError',
                wrongReason: "파일 경로 설정을 잘못함. 존재하지 않는 파일명을 사용함.",
                relatedConcept: "File System Operations",
                attemptCount: 1
            }
        })
    }
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
