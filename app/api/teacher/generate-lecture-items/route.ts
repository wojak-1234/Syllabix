import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { lectureTitle, learningObjective, targetLevel, lectureContent } = await req.json()

    if (!lectureTitle || !learningObjective) {
      return NextResponse.json({ error: 'Lecture title and objective are required' }, { status: 400 })
    }

    const systemPrompt = `당신은 프로그래밍 교육 전문가입니다.
강의 정보를 바탕으로 퀴즈 3개와 코딩 테스트 1개를 생성하세요.

[규칙]
1. 모든 문제는 제공된 '강의 본문' 범위 내에서만 출제하세요.
2. 학습 목표 달성 및 본문 맥락(코드, 용어)을 활용해 일관성을 유지하세요.

JSON 형식으로 응답하며 스키마를 준수하십시오:
{
  "quizzes": [{ "question": "내용", "choices": [{ "label": "선택지", "isCorrect": bool }], "explanation": "해설", "conceptTag": "키워드" }],
  "codingTests": [{ "title": "제목", "description": "설명", "starterCode": "코드", "testCases": [{ "input": "입", "expectedOutput": "출" }], "solutionCode": "답", "gradingCriteria": "기준", "conceptTag": "개념" }]
}

비고: 난이도는 '${targetLevel || 'beginner'}' 수준 반영, 본문 복기를 돕도록 작성.`

    const userPrompt = `[강의 정보]
제목: ${lectureTitle}
학습 목표: ${learningObjective}
본문 내용: ${lectureContent || "내용 없음 (제목과 목표 기반으로 생성)"}`

    const model = getGeminiModel({
      responseMimeType: "application/json",
      temperature: 0.2, // 재현성과 정밀도를 위해 낮게 조정
    }, MODELS.STANDARD)

    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`)
    const response = await result.response
    const text = response.text()
    
    if (!text) {
      throw new Error("AI response was empty")
    }

    const data = JSON.parse(text)

    return NextResponse.json({ data })

  } catch (error: any) {
    console.error("AI Generation Error:", error)
    return NextResponse.json({ error: 'Failed to generate items', details: error.message }, { status: 500 })
  }
}
