import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, genAI } from '@/lib/gemini'
import { formatCoursesForPrompt } from '@/data/mock-courses'

const chatResponseSchema = {
  type: "object",
  properties: {
    reply: { type: "string" }
  },
  required: ["reply"]
}

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
    const { messages, initialForm, onboardingResult, action } = await req.json()

    // ── 1. 다음 질문 생성 (action: 'chat') ──────────────────────────────
    if (action === 'chat') {
      const answeredCount = messages.filter((m: any) => m.role === 'user').length
      const MAX_TURNS = 3 // 1: 언어특정, 2: 학습스타일, 3: 어려워하는 부분

      if (answeredCount < MAX_TURNS) {
        const model = getGeminiModel({
          responseMimeType: 'application/json',
          // @ts-ignore
          responseSchema: chatResponseSchema,
        })

        const conversationHistory = messages.map((m: any) => `${m.role === 'user' ? '학습자' : 'AI'}: ${m.content}`).join('\n')
        
        let turnGuidance = ""
        if (answeredCount === 0) {
           turnGuidance = `1. 첫 번째 질문: 사용자가 입력한 학습 목표("${initialForm.goal}")를 바탕으로, 이를 달성하기 위해 사용자가 염두에 두고 있는 구체적인 기술 스택이나 도구(예: 언어, 프레임워크, 엔진 등)를 특정하도록 유도하는 질문을 하세요. 상황에 맞는 적절한 2~3가지 선택지를 예시로 제시해주세요.`
        } else if (answeredCount === 1) {
           turnGuidance = "2. 두 번째 질문: 이전에 답한 내용을 바탕으로, 앞으로의 학습을 진행할 때 선호하는 학습 방식(이론 중심, 프로젝트 중심, 인강, 도서, 클론 코딩 등)에 대해 물어보세요."
        } else {
           turnGuidance = "3. 세 번째 질문: 과거에 무언가를 학습하며 가장 포기하고 싶었거나 어려웠던 경험, 또는 이번 학습에서 가장 걱정되는 병목 포인트(예: 알고리즘 설계, 에러 핸들링, 환경 설정 등)가 무엇인지 물어보세요."
        }

        const prompt = `당신은 코딩 교육 전문 컨설턴트입니다. 사용자의 목표에 최적화된 맞춤형 질문 하나만 생성하세요.
        [초기 진단 정보]
        - 목표: ${initialForm.goal}
        - 현재 수준: ${initialForm.currentLevel}
        
        [이전 대화 기록]
        ${conversationHistory}
        
        [다음 질문 생성 지침]
        **${turnGuidance}**
        
        답변은 1~2문장의 길지 않은 내용으로, 친절하고 부드러운 톤으로 작성하세요. json 포맷으로 응답하세요.`

        const result = await model.generateContent(prompt)
        const parsed = JSON.parse(result.response.text())

        return NextResponse.json({
          reply: parsed.reply,
          done: false,
          progress: Math.round((answeredCount / MAX_TURNS) * 100)
        })
      }

      // 모든 질문 완료
      return NextResponse.json({
        reply: "완벽해요! 모든 정보를 수집했습니다. 조금 전 분석한 데이터를 바탕으로 당신만을 위한 💡 예리한 진단 테스트를 준비할게요. 하단의 시작하기 버튼을 눌러주세요!",
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

      const prompt = `당신은 초개인화 학습 설계 전문가입니다.
      아래의 학습자 상담 내용과 실제 진단 테스트 결과를 종합하여 완벽한 커리큘럼을 JSON으로 설계해주세요.

      [1. 기본 정보]
      - 최종 목표: ${initialForm.goal}
      - 자가진단 수준: ${initialForm.currentLevel}
      - 주당 학습 시간: ${initialForm.hoursPerWeek}시간
      - 제외 희망 기술: ${initialForm.excludes || '없음'}

      [2. 상담 내용 (성향/방법론)]
      ${conversationSummary}

      [3. 실제 진단 결과 (AI 분석)]
      - 판정 수준: ${onboardingResult?.level || 'N/A'}
      - 강점: ${onboardingResult?.strengths?.join(', ') || 'N/A'}
      - 약점: ${onboardingResult?.weaknesses?.join(', ') || 'N/A'}
      - 분석 내용: ${onboardingResult?.analysis || 'N/A'}

      [설계 지침]
      1. 상담에서 파악된 학습 성향(예: 프로젝트 중심)에 맞춰 주차별 주제를 선정하세요.
      2. 진단 결과에서 드러난 '약점' 부분은 초반 주차에 보강하거나 더 긴 시간을 할당하여 설계하세요.
      3. 판정 수준(${onboardingResult?.level})에 맞는 난이도의 학습 과제를 목표로 삼으세요.
      4. 각 단계별로 가장 적합한 실제 학습 자료를 아래 [가용 강의 지식 베이스]에서 검색하여 제일 연관성이 높은 강의들의 ID를 'linkedCourseIds' 배열에 넣어야 합니다. 알맞은 것이 여러 개면 모두 넣고, 없으면 빈 배열로 두세요.
      5. JSON 스키마를 엄격히 준수하여 응답하세요.

      [가용 강의 지식 베이스 (강의/자료 RAG 인덱스)]
      ${formatCoursesForPrompt()}
      `

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
