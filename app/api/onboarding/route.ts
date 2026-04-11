import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

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

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        // @ts-ignore
        responseSchema: onboardingSchema,
      }
    })

    const prompt = `학습자의 온보딩 진단 테스트 답변을 분석하여 현재 수준과 학습 방향을 결정하세요.
    
    진단 테스트 답변:
    ${JSON.stringify(answers, null, 2)}
    
    지침:
    1. 답변의 정확도보다 사고방식과 접근법을 위주로 평가하세요.
    2. 강점과 약점을 구체적으로 식별하세요.
    3. JSON 형식으로만 응답하세요.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    return NextResponse.json(JSON.parse(responseText))
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
