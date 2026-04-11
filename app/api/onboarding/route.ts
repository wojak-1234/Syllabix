import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini'

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
          question: { type: "string" },
          description: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" }
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
    const { action, goal, answers } = await req.json()

    // 1. 문제 생성 모드
    if (action === 'generate') {
      const model = getGeminiModel({
        responseMimeType: "application/json",
        // @ts-ignore
        responseSchema: questionSchema,
      })

      const prompt = `사용자의 학습 목표: "${goal}"
      이 목표를 달성하기 위해 필요한 현재 실력을 측정할 수 있는 진단 문제 5개를 생성하세요.
      입문부터 중급까지의 난이도를 섞어서 구성하고, 지문을 읽고 답을 선택할 수 있는 4지선다형으로 만드세요.
      중간에 실제 코드 해석 문제나 개념 정의 문제를 포함하세요. 한글로 응답하세요.`

      const result = await model.generateContent(prompt)
      return NextResponse.json(JSON.parse(result.response.text()))
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
