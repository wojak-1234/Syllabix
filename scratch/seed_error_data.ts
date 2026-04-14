
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const students = ['student-2', 'student-3', 'student-4']
  const seriesId = 'mock-파이썬으로-시작하는-자동화의-세계'
  
  const lectures = [
    { id: 'cmnxbtunq0001pzhqitov34z4', title: 'Python 환경 설정과 기본 문법' },
    { id: 'cmnxbtvwy0003pzhqu7bxl39g', title: '웹 스크레이핑 기본' },
    { id: 'cmnxbtwws0005pzhquk0v301t', title: '엑셀 데이터 자동 처리' },
    { id: 'cmnxbtxqp0007pzhqg0c4fcc8', title: '이메일 대량 발송 스크립트' }
  ]

  console.log("Seeding submissions and error notes...")

  for (const studentId of students) {
    // Lecture 1: All passed
    await prisma.submission.create({
      data: {
        studentId,
        lectureId: lectures[0].id,
        code: "print('hello')",
        passed: true,
        attemptNumber: 1,
        dynamicQuestionTitle: "기본 출력"
      }
    })

    // Lecture 2: Web Scraping - 2 students failed multiple times
    if (studentId === 'student-3' || studentId === 'student-4') {
      await prisma.submission.createMany({
        data: [
          {
            studentId,
            lectureId: lectures[1].id,
            code: "requests.get(url)",
            passed: false,
            attemptNumber: 1,
            errorType: 'ImportError',
            errorMessage: 'No module named "requests"',
            dynamicQuestionTitle: "웹 요청 보내기"
          },
          {
            studentId,
            lectureId: lectures[1].id,
            code: "import requests; requests.get(url)",
            passed: false,
            attemptNumber: 2,
            errorType: 'ConnectionError',
            errorMessage: 'Max retries exceeded with url',
            dynamicQuestionTitle: "웹 요청 보내기"
          }
        ]
      })

      // Create ErrorNote
      await prisma.errorNote.create({
        data: {
          studentId,
          lectureId: lectures[1].id,
          problemTitle: "웹 요청 보내기",
          errorType: 'ConnectionError',
          wrongReason: "네트워크 연결 라이브러리(requests)의 예외 처리를 누락함. 특히 타임아웃이나 서버 응답 지연에 대한 대응이 부족함.",
          relatedConcept: "Network Exception Handling",
          attemptCount: 2
        }
      })
    } else {
       await prisma.submission.create({
        data: {
          studentId,
          lectureId: lectures[1].id,
          code: "import requests; r = requests.get('http://google.com')",
          passed: true,
          attemptNumber: 1,
          dynamicQuestionTitle: "웹 요청 보내기"
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
                    code: "wb = openpyxl.load_workbook('data.xlsx')",
                    passed: false,
                    attemptNumber: 1,
                    errorType: 'FileNotFoundError',
                    errorMessage: "[Errno 2] No such file or directory: 'data.xlsx'",
                    dynamicQuestionTitle: "엑셀 로딩"
                }
            ]
        })
        await prisma.errorNote.create({
            data: {
                studentId,
                lectureId: lectures[2].id,
                problemTitle: "엑셀 로딩",
                errorType: 'FileNotFoundError',
                wrongReason: "파일 경로 절대경로와 상대경로에 대한 이해가 부족하여 파일을 찾지 못함.",
                relatedConcept: "File Path System",
                attemptCount: 1
            }
        })
    }
  }

  console.log("Seeding completed!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
