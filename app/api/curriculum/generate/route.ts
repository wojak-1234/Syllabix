import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY || ''
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in the environment variables.")
}
const genAI = new GoogleGenerativeAI(apiKey)

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
    const { goal, currentLevel, hoursPerWeek, excludes } = await req.json()

    // Mock Database functionality
    const availableCourses = [
      { id: "c1", title: "React 입문", tags: ["React", "Frontend"], difficulty: "Beginner" },
      { id: "c2", title: "Node.js 실전", tags: ["Node.js", "Backend"], difficulty: "Intermediate" },
      { id: "c3", title: "TypeScript 마스터", tags: ["TypeScript"], difficulty: "Advanced" }
    ]

    const systemPrompt = `당신은 교육 커리큘럼 전문가입니다.
학습자의 목표와 현재 수준을 분석해서 최적화된 학습 경로를 설계하세요.

반드시 JSON 형식으로만 응답하고, 다음 원칙을 따르세요:
1. 현재 수준에서 목표까지 역산해서 단계를 설계한다
2. 주당 학습 시간을 기반으로 현실적인 주차를 계산한다
3. 과거 학습자 패턴 기반으로 riskLevel을 정확히 예측한다
4. 가능하면 아래 제공된 강의 중 관련 강의 ID를 linkedCourseIds에 포함시켜라

사용 가능한 강의 목록:
${JSON.stringify(availableCourses, null, 2)}`

    const userPrompt = `학습자 정보:
- 최종 목표: ${goal}
- 현재 수준: ${currentLevel}
- 주당 학습 시간: ${hoursPerWeek}시간
- 제외 희망: ${excludes || '없음'}

위 정보를 바탕으로 최적 커리큘럼을 분석하고 지정된 JSON 스키마 구조로 결과만 출력해줘.`

    // Use Gemini 1.5 Pro
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        // @ts-ignore
        responseSchema: curriculumSchema,
        temperature: 0.2,
      }
    })

    const result = await model.generateContent(
      systemPrompt + '\n\n' + userPrompt
    )

    const response = await result.response
    const responseText = response.text()
    if (!responseText) {
      throw new Error("No response generated from Gemini")
    }

    const curriculum = JSON.parse(responseText)

    // DB 저장 진행 (Mock)
    let savedId = `curri-${Date.now()}`

    return NextResponse.json({ curriculum, curriculumId: savedId })

  } catch (error: any) {
    console.error("Gemini API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate curriculum", details: error.message },
      { status: 500 }
    )
  }
}
