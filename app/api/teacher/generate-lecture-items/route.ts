import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { lectureTitle, learningObjective, targetLevel } = await req.json()

    if (!lectureTitle || !learningObjective) {
      return NextResponse.json({ error: 'Lecture title and objective are required' }, { status: 400 })
    }

    const systemPrompt = `당신은 컴퓨터 과학 및 프로그래밍 교육 전문가입니다.
특정 강의의 제목과 학습 목표를 바탕으로, 해당 강의의 내용을 평가하기 위한 퀴즈(객관식) 3개와 코딩 테스트 문제 1개를 생성하세요.

반드시 JSON 형식으로만 응답하며, 다음 스키마를 준수하십시오:
{
  "quizzes": [
    {
      "question": "문제 내용 (한국어)",
      "choices": [
        { "label": "선택지 1", "isCorrect": false },
        { "label": "선택지 2", "isCorrect": true },
        { "label": "선택지 3", "isCorrect": false },
        { "label": "선택지 4", "isCorrect": false }
      ],
      "explanation": "정답에 대한 상세 해설 (한국어)",
      "conceptTag": "평가하는 핵심 개념 키워드"
    }
  ],
  "codingTests": [
    {
      "title": "코딩 테스트 제목 (한국어)",
      "description": "문제 설명. 요구사항 및 제한 사항을 포함 (한국어)",
      "starterCode": "수강생에게 제공할 기초 코드 (보일러플레이트)",
      "testCases": [
        { "input": "입력 예시 1", "expectedOutput": "출력 예시 1" },
        { "input": "입력 예시 2", "expectedOutput": "출력 예시 2" }
      ],
      "solutionCode": "정답 모범 예시 코드",
      "gradingCriteria": "채점 기준 및 힌트 (한국어)",
      "conceptTag": "평가하는 코드 핵심 개념"
    }
  ]
}

주의사항:
1. 난이도는 '${targetLevel || 'beginner'}' 수준에 맞춰야 합니다.
2. 퀴즈는 총 3개를 생성하며, 각 퀴즈는 4지 선다형입니다.
3. 코딩 테스트는 1개를 생성하며, 실용적이고 학습 목표에 부합해야 합니다.
4. 설명과 해설은 친절하고 전문적이어야 합니다.`

    const userPrompt = `강의 제목: ${lectureTitle}
학습 목표: ${learningObjective}`

    const model = getGeminiModel({
      responseMimeType: "application/json",
      temperature: 0.8,
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
