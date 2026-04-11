import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { ApiCache } from '@/lib/cache'
import { buildOnboardingQuestionPrompt } from '@/lib/prompts'

const onboardingSchema = {
  type: "object",
  properties: {
    level: { type: "string", enum: ["Beginner", "Junior", "Intermediate", "Advanced"] },
    strengths: { type: "array", items: { type: "string" } },
    weaknesses: { type: "array", items: { type: "string" } },
    recommendedFocus: { type: "string" },
    analysis: { type: "string" }
  },
  required: ["level", "strengths", "weaknesses", "recommendedFocus", "analysis"]
}

const questionSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          question: { type: "string", description: "문제 내용" },
          description: { type: "string", description: "문제의 의도 설명" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string", description: "실제 선택지 내용 (예: '1과 2를 더한다', 'Undefined 오류 발생' 등). 절대로 'A', 'B' 같은 기호를 넣지 말고 내용을 넣을 것." },
                value: { type: "string", description: "각 선택지를 구분하는 고유 영문 값 (예: 'opt_1', 'opt_2')" }
              }
            }
          }
        },
        required: ["id", "question", "description", "options"]
      }
    }
  },
  required: ["questions"]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, goal, chatContext, answers } = body

    // 1. 문제 생성 모드
    if (action === 'generate') {
      const cacheKey = ApiCache.generateKey('onboarding_gen', { goal, chatContext })
      const cachedData = ApiCache.get(cacheKey)

      if (cachedData) {
        console.log(`[Onboarding] Returning CACHED questions for goal: ${goal}`)
        return NextResponse.json(cachedData)
      }
      const model = getGeminiModel(
        { responseMimeType: "application/json", responseSchema: questionSchema as any },
        MODELS.STANDARD  // 온보딩 문제 생성: Standard 모델
      )

      const contextSummary = chatContext 
        ? chatContext.messages.map((m: any) => m.content).join(' | ') 
        : "정보 없음"

      const targetGoal = chatContext?.initialForm?.goal || goal || "프로그래밍"
      const currentLevel = chatContext?.initialForm?.currentLevel || "beginner"

      const prompt = buildOnboardingQuestionPrompt({ targetGoal, currentLevel, contextSummary })

      const result = await model.generateContent(prompt)
      const data = JSON.parse(result.response.text())
      
      ApiCache.set(cacheKey, data)
      return NextResponse.json(data)
    }


    // 2. 최종 결과 분석 모드
    const model = getGeminiModel({
      responseMimeType: "application/json",
      // @ts-ignore
      responseSchema: onboardingSchema,
    })

    const prompt = `학습자의 온보딩 진단 테스트 답변을 분석하여 현재 수준과 학습 방향을 결정하세요.
    학습 목표: "${goal}"
    진단 테스트 답변:
    ${JSON.stringify(answers, null, 2)}
    
    지침:
    1. 답변의 정확도보다 사고방식과 접근법을 위주로 평가하세요.
    2. 강점과 약점을 구체적으로 식별하세요.
    3. JSON 형식으로만 응답하세요.`

    const result = await model.generateContent(prompt)
    return NextResponse.json(JSON.parse(result.response.text()))
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
