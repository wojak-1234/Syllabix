import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { lectureTitle, learningObjective, targetLevel, lectureContent } = await req.json()

    if (!lectureTitle || !learningObjective) {
      return NextResponse.json({ error: 'Lecture title and objective are required' }, { status: 400 })
    }

    const systemPrompt = `당신은 컴퓨터 과학 및 프로그래밍 교육 전문가입니다.
특정 강의의 제목, 학습 목표, 그리고 강의 본문을 바탕으로, 해당 강의의 내용을 평가하기 위한 퀴즈(객관식) 3개와 코딩 테스트 문제 1개를 생성하세요.

[핵심 규칙]
1. 생성되는 모든 문제는 제공된 '강의 본문'의 범위 내에서 다뤄져야 합니다. 본문에서 설명하지 않은 고난도 개념이나 외부 지식을 문제로 내지 마세요.
2. 퀴즈와 코딩 테스트는 학습 목표를 달성했는지 확인하는 가장 효과적인 수단이어야 합니다.
3. 본문에 포함된 예제 코드나 특정 용어를 활용하여 문제의 맥락(Context)을 일관성 있게 유지하세요.

반드시 JSON 형식으로만 응답하며, 다음 스키마를 준수하십시오:
{
  "quizzes": [
    {
      "question": "문제 내용 (강의 본문 맥락 반영)",
      "choices": [
        { "label": "선택지 1", "isCorrect": false },
        { "label": "선택지 2", "isCorrect": true },
        { "label": "선택지 3", "isCorrect": false },
        { "label": "선택지 4", "isCorrect": false }
      ],
      "explanation": "본문 내용을 기반으로 한 상세 해설",
      "conceptTag": "키워드"
    }
  ],
  "codingTests": [
    {
      "title": "코딩 테스트 제목",
      "description": "본문의 예제나 시나리오를 활용한 문제 설명",
      "starterCode": "기초 코드",
      "testCases": [
        { "input": "입력", "expectedOutput": "출력" }
      ],
      "solutionCode": "모범 답안",
      "gradingCriteria": "채점 기준",
      "conceptTag": "핵심 개념"
    }
  ]
}

주의사항:
1. 난이도는 '${targetLevel || 'beginner'}' 수준에 맞추되 본문 난이도를 우선순위로 합니다.
2. 퀴즈는 총 3개, 코딩 테스트는 1개를 생성합니다.
3. 설명과 해설은 학생이 본문을 복기할 수 있도록 작성하세요.`

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
