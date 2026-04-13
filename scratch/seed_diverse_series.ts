import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const teacherId = 'teacher-1'

  // 강사 유저 유무 확인 및 생성 (외래키 제약 해결)
  await prisma.user.upsert({
    where: { id: teacherId },
    update: {},
    create: {
      id: teacherId,
      email: 'teacher1@syllabix.com',
      name: '홍길동 강사',
      role: 'TEACHER'
    }
  })

  const mockSeries = [
    {
      title: "파이썬으로 시작하는 자동화의 세계",
      description: "지루한 업무를 파이썬 스크립트로 자동화하는 방법을 배웁니다. 엑셀, 이메일, 웹 크롤링 포함.",
      targetLevel: "beginner",
      goal: "업무 자동화 역량 강화"
    },
    {
      title: "React 프론트엔드 마스터 클래스",
      description: "컴포넌트 설계부터 Recoil 상태관리, 성능 최적화까지 리액트의 모든 것.",
      targetLevel: "intermediate",
      goal: "현업 수준의 프론트엔드 개발자"
    },
    {
      title: "Next.js 15: 완벽한 풀스택 가이드",
      description: "서버 컴포넌트, App Router, 그리고 Server Actions를 활용한 최신 웹 개발.",
      targetLevel: "advanced",
      goal: "고도로 확장 가능한 웹 서비스 구축"
    },
    {
      title: "로블록스 게임 제작 입문 (Lua 코딩)",
      description: "나만의 게임을 만들고 수익화하는 로블록스 스튜디오 완벽 활용법.",
      targetLevel: "beginner",
      goal: "게임 메이커 학습"
    },
    {
      title: "Node.js 백엔드 아키텍처",
      description: "Express와 NestJS를 넘나드는 견고한 서버 사이드 설계 패턴.",
      targetLevel: "intermediate",
      goal: "안정적인 API 서버 개발"
    },
    {
      title: "자료구조와 알고리즘 (C++)",
      description: "기초부터 심화까지, 코딩 테스트 합격을 위한 필수 핵심 문제 풀이.",
      targetLevel: "intermediate",
      goal: "기술 면접 및 코딩테스트 통과"
    },
    {
      title: "데이터 과학을 위한 Pandas와 NumPy",
      description: "데이터 전처리부터 시각화까지, 분석가의 핵심 도구를 마스터합니다.",
      targetLevel: "beginner",
      goal: "데이터 분석가 입문"
    }
  ]

  for (const s of mockSeries) {
    await prisma.series.upsert({
      where: { id: `mock-${s.title.replace(/\s+/g, '-')}` },
      update: { status: 'PUBLISHED' },
      create: {
        id: `mock-${s.title.replace(/\s+/g, '-')}`,
        teacherId,
        title: s.title,
        description: s.description,
        targetLevel: s.targetLevel,
        goal: s.goal,
        status: 'PUBLISHED',
        visibility: 'PUBLIC'
      }
    })
  }

  console.log(`Successfully seeded ${mockSeries.length} diverse mock series.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
