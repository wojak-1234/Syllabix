import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini'

const phaseSchema = {
  type: "object",
  properties: {
    phaseNumber: { type: "integer" },
    title: { type: "string" },
    weekRange: { type: "string", description: "e.g., 'Week 1-3'" },
    topics: { type: "array", items: { type: "string" } },
    milestone: { type: "string" },
    riskLevel: { type: "string", enum: ['low', 'medium', 'high'] },
    riskReason: { type: "string" },
    linkedCourseIds: { type: "array", items: { type: "string" } }
  },
  required: [
    "phaseNumber", "title", "weekRange", "topics",
    "milestone", "riskLevel", "riskReason", "linkedCourseIds"
  ]
}

const curriculumSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    totalWeeks: { type: "integer" },
    totalHours: { type: "integer" },
    phases: {
      type: "array",
      items: phaseSchema
    },
    aiInsight: { type: "string", description: "AI가 감지한 이탈 위험 구간 등" }
  },
  required: ["title", "totalWeeks", "totalHours", "phases", "aiInsight"]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { goal, currentLevel, hoursPerWeek, excludes } = body
    console.log("[Curriculum API] Received request:", { goal, currentLevel, hoursPerWeek })

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 })
    }

    // Mock Database functionality
    const availableCourses = [
      { id: "c1", title: "React 입문", tags: ["React", "Frontend"], difficulty: "Beginner" },
      { id: "c2", title: "Node.js 실전", tags: ["Node.js", "Backend"], difficulty: "Intermediate" },
      { id: "c3", title: "TypeScript 마스터", tags: ["TypeScript"], difficulty: "Advanced" }
    ]

    const systemPrompt = `당신은 전 세계의 학습 데이터를 분석하여 최적의 학습 경로를 설계하는 'Syllabix 수석 교육 설계자(Senior Learning Architect)'입니다. 
당신의 목표는 단순한 일정표 작성이 아니라, 학습자의 인지적 과부하를 방지하고 동기를 극대화하는 '전략적 마스터플랜'을 수립하는 것입니다.

[당신의 페르소나 및 원칙]
1. 분석적 사고: 학습자의 현재 수준과 목표 사이의 '지식 격차(Knowledge Gap)'를 정밀하게 진단합니다.
2. 현실적 제약 고려: 주당 가용 시간을 바탕으로 실현 불가능한 계획은 지양하고, 집중이 필요한 구간에서 학습 밀도를 조정합니다.
3. 이탈 방지 전략 (Risk Management): 과거 데이터를 기반으로 학습자가 포기하기 쉬운 '고비(Risk Points)'를 예측하고, 이를 극복하기 위한 인사이트를 aiInsight 필드에 상세히 기록합니다.
4. 배제 원칙: 학습자가 제외하고 싶어 하는 기술이나 방식은 철저히 배제하되, 필수적인 대체 개념이 있다면 제안합니다.

반드시 JSON 형식으로만 응답하며, 지정된 JSON 스키마 구조를 엄격히 준수하세요.`

    const userPrompt = `[학습자 커스터마이징 요청]
- 관심 주제 및 목표: ${goal}
- 현재 숙련도: ${currentLevel}
- 주당 학습 가용 시간: ${hoursPerWeek}시간
- 학습 환경 제약/제외 사항: ${excludes || '없음'}

사용 가능한 강의 리소스를 참고하여, 이 학습자만을 위한 독창적이고 전문적인 커리큘럼을 생성하세요. 
강의 목록: ${JSON.stringify(availableCourses)}`

    // Use Gemini
    const model = getGeminiModel({
      responseMimeType: "application/json",
      // @ts-ignore
      responseSchema: curriculumSchema,
      temperature: 0.2,
    })

    console.log("[Curriculum API] Calling Gemini...")
    const result = await model.generateContent(
      systemPrompt + '\n\n' + userPrompt
    )

    const response = await result.response
    const responseText = response.text()
    console.log("[Curriculum API] Gemini Response Received")

    if (!responseText) {
      throw new Error("No response generated from Gemini")
    }

    const curriculum = JSON.parse(responseText)

    // DB 저장 진행 (Mock)
    let savedId = `curri-${Date.now()}`

    return NextResponse.json({ curriculum, curriculumId: savedId })

  } catch (error: any) {
    console.error("[Curriculum API] Error:", error)
    return NextResponse.json(
      { error: "Failed to generate curriculum", details: error.message },
      { status: 500 }
    )
  }
}
