import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini'

const blindPointSchema = {
  type: "object",
  properties: {
    identifiedVulnerabilities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          concept: { type: "string" },
          confidence: { type: "number" },
          evidenceReason: { type: "string" },
          suggestedReviewSection: { type: "string" }
        }
      }
    },
    isCurriculumResetNeeded: { type: "boolean" },
    actionPlan: { type: "string" }
  },
  required: ["identifiedVulnerabilities", "isCurriculumResetNeeded", "actionPlan"]
}

export async function POST(req: NextRequest) {
  try {
    const { userActivityLog } = await req.json()

    const model = getGeminiModel({
      responseMimeType: "application/json",
      // @ts-ignore
      responseSchema: blindPointSchema,
    })

    const prompt = `학습자의 활동 로그(퀴즈 오답, IDE 시도 히스토리 등)를 분석하여 '모르는 줄 모르는' 취약 개념(Blind Points)을 찾아내세요.
    
    활동 로그:
    ${JSON.stringify(userActivityLog, null, 2)}
    
    분석 기준:
    1. 동일한 키워드에서 반복되는 오답 패턴
    2. IDE 실습에서 논리적인 해결을 하지 못하고 방황하는 구간
    3. 특정 강의 섹션의 반복 재생 기록`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    return NextResponse.json(JSON.parse(responseText))
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
