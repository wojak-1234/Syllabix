import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const PREFERENCE_QUESTIONS = [
  "학습하고 싶은 프로그래밍 언어나 기술 스택이 있나요? (예: Python, JavaScript, React 등)",
  "선호하는 학습 방식은 무엇인가요? (예: 이론 중심, 프로젝트 중심, 문제 풀이 중심 등)",
  "학습하면서 가장 어렵게 느끼는 부분이 있나요? (예: 수학, 알고리즘, 개념 이해 등)",
  "목표 직군이나 진로 방향이 있나요? (예: 웹 개발자, 데이터 사이언티스트, 취업, 대학원 등)",
]

// Final curriculum schema as plain object for @ts-ignore
const curriculumSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    totalWeeks: { type: "integer" },
    totalHours: { type: "integer" },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          phaseNumber: { type: "integer" },
          title: { type: "string" },
          weekRange: { type: "string" },
          topics: { type: "array", items: { type: "string" } },
          milestone: { type: "string" },
          riskLevel: { type: "string", enum: ["low", "medium", "high"] },
          riskReason: { type: "string" },
          linkedCourseIds: { type: "array", items: { type: "string" } }
        },
        required: ["phaseNumber", "title", "weekRange", "topics", "milestone", "riskLevel", "riskReason", "linkedCourseIds"]
      }
    },
    aiInsight: { type: "string" }
  },
  required: ["title", "totalWeeks", "totalHours", "phases", "aiInsight"]
}

export async function POST(req: NextRequest) {
  try {
    const { messages, initialForm, action } = await req.json()

    // ── 1. 다음 질문 생성 (action: 'chat') ──────────────────────────────
    if (action === 'chat') {
      const answeredCount = messages.filter((m: any) => m.role === 'user').length

      // 아직 물어볼 질문이 남아있으면 다음 질문
      if (answeredCount < PREFERENCE_QUESTIONS.length) {
        const nextQuestion = PREFERENCE_QUESTIONS[answeredCount]
        return NextResponse.json({
          reply: nextQuestion,
          done: false,
          progress: Math.round((answeredCount / PREFERENCE_QUESTIONS.length) * 100)
        })
      }

      // 모든 질문을 마쳤으면 완료 메시지
      return NextResponse.json({
        reply: "완벽해요! 모든 정보를 수집했습니다. 지금 AI가 당신만을 위한 최적의 커리큘럼을 설계하고 있어요. 잠시만 기다려 주세요... ✨",
        done: true,
        progress: 100
      })
    }

    // ── 2. 최종 커리큘럼 생성 (action: 'generate') ───────────────────────
    if (action === 'generate') {
      const conversationSummary = messages
        .map((m: any) => `${m.role === 'user' ? '학습자' : 'AI'}: ${m.content}`)
        .join('\n')

      const model = genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        generationConfig: {
          responseMimeType: 'application/json',
          // @ts-ignore
          responseSchema: curriculumSchema,
          temperature: 0.2,
        }
      })

      const prompt = `당신은 교육 커리큘럼 전문가입니다.
아래의 학습자 기본 정보와 대화 내용을 종합하여 최적의 커리큘럼을 JSON으로 설계해주세요.

[기본 정보]
- 최종 목표: ${initialForm.goal}
- 현재 수준: ${initialForm.currentLevel}
- 주당 학습 시간: ${initialForm.hoursPerWeek}시간
- 제외 희망: ${initialForm.excludes || '없음'}

[상세 대화 기록]
${conversationSummary}

위 정보를 바탕으로 완성도 높은 학습 로드맵을 JSON 스키마에 맞게 설계해줘.
각 phase마다 riskLevel과 riskReason을 반드시 포함하고, aiInsight에는 전체 학습 여정에 대한 종합 분석을 담아줘.`

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()
      const curriculum = JSON.parse(responseText)

      return NextResponse.json({ curriculum })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    )
  }
}
