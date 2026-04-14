
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const emptySeries = [
    { id: 'mock-Next.js-15:-완벽한-풀스택-가이드', title: 'Next.js 15: 완벽한 풀스택 가이드', lectures: ['App Router 이해', 'Server Components vs Client Components', 'Data Fetching & Mutations'] },
    { id: 'mock-로블록스-게임-제작-입문-(Lua-코딩)', title: '로블록스 게임 제작 입문 (Lua 코딩)', lectures: ['Roblox Studio 시작하기', 'Part 속성 제어', '이벤트와 함수'] },
    { id: 'mock-Node.js-백엔드-아키텍처', title: 'Node.js 백엔드 아키텍처', lectures: ['Event Loop & Blocking', 'Express Framework 기초', 'Prisma ORM 설정'] },
    { id: 'mock-자료구조와-알고리즘-(C++)', title: '자료구조와 알고리즘 (C++)', lectures: ['시간 복잡도 분석', 'Array & Linked List', 'Stack & Queue'] },
    { id: 'mock-데이터-과학을-위한-Pandas와-NumPy', title: '데이터 과학을 위한 Pandas와 NumPy', lectures: ['NumPy 다차원 배열', 'Pandas DataFrame 기초', '데이터 결측치 처리'] }
  ]

  console.log("Adding lectures to empty series...")

  for (const s of emptySeries) {
    for (let i = 0; i < s.lectures.length; i++) {
      await prisma.lecture.upsert({
        where: {
          seriesId_order: { seriesId: s.id, order: i + 1 }
        },
        update: {},
        create: {
          seriesId: s.id,
          order: i + 1,
          title: s.lectures[i],
          learningObjective: `${s.lectures[i]} 개념 완벽 이해`,
          conceptTags: s.lectures[i].split(' ').join(','),
          content: `${s.lectures[i]}에 대한 상세한 설명 본문입니다.`
        }
      })
    }
  }

  console.log("Lectures added!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
