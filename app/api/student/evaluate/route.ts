import { NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { code, questionTitle, questionDescription, attempts } = await request.json()

    if (code === undefined) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    // 사용할 모델 선택 (코드 분석 및 힌트 제공)
    const model = getGeminiModel(
      { responseMimeType: "application/json" },
      MODELS.STANDARD
    )

    const prompt = `
당신은 학생들의 프로그래밍 코드를 분석하고 피드백을 주는 따뜻하고 완전 전문적인 AI 튜터입니다.
학생이 다음 문제에 대해 파이썬 코드를 작성했습니다.

[문제 제목]
${questionTitle}

[문제 설명]
${questionDescription}

[작성한 코드]
\`\`\`python
${code}
\`\`\`

[과거 시도 횟수]
${attempts}회

학생의 코드가 문제를 정확히 해결하는지 검토하고, 오류를 감지하여 유용한 피드백을 주세요. 결과를 올바른 JSON 형태로 반환해주세요.
평가 기준은 다음과 같습니다:
1. isCorrect (boolean): 코드가 문법적으로 완벽한지, 논리적으로 맞으며 문제의 요구사항을 모두 충족하는지.
2. feedback (string): 만약 틀렸다면, 정답 코드를 바로 주지 말고 스스로 생각할 수 있도록 방향성을 제시하는 친절한 힌트를 작성할 것. 구문 에러나 논리적 오류가 감지되었다면 그 부분을 부드럽게 지적할 것. ${attempts >= 2 ? "여러 번 시도했으므로 조금 더 구체적으로 어떤 함수나 조건을 어떻게 써야할 지 팁을 줄 것." : ""} 정답이라면 칭찬과 함께 핵심 내용을 깔끔하게 요약해줄 것.

응답 JSON 구조:
{
  "isCorrect": boolean,
  "feedback": "string"
}
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    let parsedData
    try {
      parsedData = JSON.parse(responseText)
    } catch (e) {
      // Fallback parsing if there are markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1])
      } else {
        throw new Error('Failed to parse AI response as JSON')
      }
    }

    return NextResponse.json(parsedData)

  } catch (error) {
    console.error('Error in evaluation:', error)
    return NextResponse.json({ error: 'Failed to evaluate code' }, { status: 500 })
  }
}
