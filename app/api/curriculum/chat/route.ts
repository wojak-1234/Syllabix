import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { formatCoursesForPrompt } from '@/data/mock-courses'
import { ApiCache } from '@/lib/cache'
import {
  buildChatTurnGuidance,
  buildPrefetchQuestionsPrompt,
  buildCurriculumPrompt,
} from '@/lib/prompts'

// ── JSON 스키마 ─────────────────────────────────────────────────────

const chatResponseSchema = {
  type: "object",
  properties: {
    reply: { type: "string" }
  },
  required: ["reply"]
}

const prefetchSchema = {
  type: "object",
  properties: {
    questions: { type: "array", items: { type: "string" } }
  },
  required: ["questions"]
}

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

    // ── 0. 질문 사전 일괄 생성 (prefetch) ───────────────────────────
    // 챗봇 세션 시작 시 3개 질문을 한 번에 생성 → 이후 API 호출 0회
    if (action === 'prefetch') {
      const cacheKey = ApiCache.generateKey('chat_questions', {
        goal: initialForm.goal,
        currentLevel: initialForm.currentLevel,
      })
      const cached = ApiCache.get<{ questions: string[] }>(cacheKey)
      if (cached) {
        console.log('[Chat Prefetch] Cache HIT')
        return NextResponse.json({ ...cached, cached: true })
      }

      const model = getGeminiModel(
        { responseMimeType: 'application/json', responseSchema: prefetchSchema as any },
        MODELS.LITE
      )
      const prompt = buildPrefetchQuestionsPrompt(initialForm.goal, initialForm.currentLevel)
      const result = await model.generateContent(prompt)
      const data = JSON.parse(result.response.text())

      ApiCache.set(cacheKey, data)
      console.log('[Chat Prefetch] Generated', data.questions?.length, 'questions')
      return NextResponse.json({ ...data, cached: false })
    }

    // ── 1. 단일 질문 생성 (action: 'chat') — 폴백용 ─────────────────
    if (action === 'chat') {
      const answeredCount = messages.filter((m: any) => m.role === 'user').length
      const MAX_TURNS = 3

      if (answeredCount < MAX_TURNS) {
        const model = getGeminiModel(
          { responseMimeType: 'application/json', responseSchema: chatResponseSchema as any },
          MODELS.LITE
        )

        const conversationHistory = messages
          .map((m: any) => `${m.role === 'user' ? '학습자' : 'AI'}: ${m.content}`)
          .join('\n')

        const turnGuidance = buildChatTurnGuidance(answeredCount, initialForm.goal)

        const prompt = `${MODELS.LITE === 'gemini-3.1-flash-lite-preview' ? '' : ''}
당신은 코딩 교육 전문 컨설턴트입니다. 사용자의 목표에 최적화된 맞춤형 질문 하나만 생성하세요.

[초기 진단 정보]
- 목표: ${initialForm.goal}
- 현재 수준: ${initialForm.currentLevel}

[이전 대화 기록]
${conversationHistory}

[다음 질문 생성 지침]
**${turnGuidance}**

답변은 1~2문장의 친절하고 부드러운 톤으로 작성하세요. JSON 형식으로 응답하세요.`

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        let parsed: any
        try {
          parsed = JSON.parse(responseText)
        } catch {
          return NextResponse.json({
            reply: responseText || "학습자님의 목표를 위해 어떤 언어나 도구를 사용하고 싶으신가요?",
            done: false,
            progress: Math.round((answeredCount / MAX_TURNS) * 100)
          })
        }

        return NextResponse.json({
          reply: parsed.reply,
          done: false,
          progress: Math.round((answeredCount / MAX_TURNS) * 100)
        })
      }

      return NextResponse.json({
        reply: "완벽해요! 모든 정보를 수집했습니다. 조금 전 분석한 데이터를 바탕으로 당신만을 위한 💡 예리한 진단 테스트를 준비할게요. 하단의 시작하기 버튼을 눌러주세요!",
        done: true,
        progress: 100
      })
    }

    // ── 2. 최종 커리큘럼 생성 (action: 'generate') ──────────────────
    if (action === 'generate') {
      // 캐시 키: 목표 + 온보딩 결과 기반
      const cacheKey = ApiCache.generateKey('curriculum', {
        goal: initialForm.goal,
        level: onboardingResult?.level,
        weaknesses: onboardingResult?.weaknesses,
      })
      const cached = ApiCache.get(cacheKey)
      if (cached) {
        console.log('[Curriculum] Cache HIT')
        return NextResponse.json({ curriculum: cached, cached: true })
      }

      const conversationSummary = messages
        .map((m: any) => `${m.role === 'user' ? '학습자' : 'AI'}: ${m.content}`)
        .join('\n')

      const model = getGeminiModel(
        { responseMimeType: 'application/json', responseSchema: curriculumSchema as any, temperature: 0.2 },
        MODELS.PRO  // 커리큘럼 설계는 Pro 모델 사용
      )

      const prompt = buildCurriculumPrompt({
        goal: initialForm.goal,
        currentLevel: initialForm.currentLevel,
        hoursPerWeek: initialForm.hoursPerWeek,
        excludes: initialForm.excludes,
        conversationSummary,
        onboardingResult,
        coursesContext: formatCoursesForPrompt(),
      })

      const result = await model.generateContent(prompt)
      const curriculum = JSON.parse(result.response.text())

      ApiCache.set(cacheKey, curriculum)
      return NextResponse.json({ curriculum, cached: false })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: any) {
    console.error('[Chat API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    )
  }
}
