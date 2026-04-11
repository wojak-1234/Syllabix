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
    const { action, goal, chatContext, answers } = await req.json()

    // 1. 문제 생성 모드
    if (action === 'generate') {
      const model = getGeminiModel({
        responseMimeType: "application/json",
        // @ts-ignore
        responseSchema: questionSchema,
      })

      const contextSummary = chatContext 
        ? chatContext.messages.map((m: any) => m.content).join(' | ') 
        : "정보 없음"

      const targetGoal = chatContext?.initialForm?.goal || goal || "프로그래밍"
      const currentLevel = chatContext?.initialForm?.currentLevel || "beginner"

      const isBeginner = currentLevel === "beginner"

      const prompt = `당신은 핵심을 짚어내는 엄격하지만 세심한 시니어 엔지니어(면접관)입니다.
      사용자는 챗봇 상담을 통해 자신의 학습 목표와 방법론, 어려워했던 부분을 공유했습니다.
      이 정보를 철저히 분석하여 사용자의 현재 수준을 파악할 수 있는 가장 굵은 맥락과 필수 지식을 묻는 5개의 객관식(4지선다형) 질문을 생성하세요.

      [사용자 정보]
      - 학습 목표: "${targetGoal}"
      - 현재 숙련도: "${currentLevel === 'beginner' ? '입문자 (기초 지식 필요)' : currentLevel}"
      - 상담 내용(성향/약점): "${contextSummary}"

      [문제 출제 지침]
      1. ${isBeginner ? "사용자가 '입문자'이므로, 지나치게 어려운 응용 문제보다는 해당 기술(예: React, Python 등)이 '왜 필요한지', '가장 기초적인 개념이 무엇인지'를 묻는 근본적이고 쉬운 문제로 구성하세요." : "사용자가 취약하다고 한 부분이나 목표 기술 스택의 '핵심 개념/원리'를 날카롭게 파고드는 질문이어야 합니다."}
      2. 단순 암기(문법)가 아닌, 동작 원리나 개념의 이유를 생각해야 풀 수 있는 문제로 구성하세요.
      3. 난이도를 점진적으로 높이되, 사용자의 '숙련도'를 반드시 반영하세요.
      4. JSON 응답 시, options의 'label'에는 A,B,C,D가 아닌 실제 선택지 내용(텍스트)을 반드시 작성해야 합니다. 한글로 응답하세요.`

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
