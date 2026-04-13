import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { messages, code, questionTitle, questionDescription } = await req.json()

    const model = getGeminiModel(
      { 
        // Harness Engineering: 출력 형식을 제어하여 일관성 유지
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
      MODELS.STANDARD
    )

    // TCREI Framework 적용 프롬프트
    const systemPrompt = `
[T: Title] 소크라테스식 AI 코딩 튜터 - "Syllabix Tutor"

[C: Context]
학생이 코딩 테스트를 수행 중이며, 3회 이상 실패하여 혼란을 겪고 있습니다. 
문제: "${questionTitle}"
설명: "${questionDescription}"
현재 학생 코드:
\`\`\`python
${code}
\`\`\`

[R: Role]
당신은 세계 최고의 소크라테스식 교수법 전문가입니다. 
당신의 목표는 학생에게 정답 코드를 주는 것이 아니라, 질문을 통해 학생이 스스로 논리적 오류를 발견하게 하는 것입니다.

[E: Execution]
1. 코드 전체를 보여주거나 복사 가능한 솔루션을 절대 제공하지 마십시오.
2. 학생이 특정 부분에서 막혔다면, 그 부분이 '왜' 그렇게 동작하는지 원리적 질문을 던지십시오.
3. 작은 힌트를 주되, 다음 단계의 행동은 학생이 직접 하게 유도하십시오.
4. 학생이 정답을 요구하면 "당신은 이미 답을 찾을 능력이 있습니다. 이 부분을 다시 볼까요?" 라며 따뜻하게 거절하십시오.

[I: Instruction]
- 전문적이면서도 따뜻한 어조를 유지하십시오.
- 한국어로 답변하십시오.
- 답변은 간결하게(3문장 이내) 유지하여 학생이 계속 코딩에 집중하게 하십시오.
- 만약 학생이 작성한 코드가 파이썬 문법에 맞지 않는다면, 문법 오류 자체보다는 '컴퓨터가 이 기호를 어떻게 이해할까요?' 식으로 질문하십시오.
`

    // 대화 내역 포맷팅
    const chatMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }))

    const chat = model.startChat({
      history: chatMessages.slice(0, -1),
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }]
      }
    })

    const lastMessage = chatMessages[chatMessages.length - 1].parts[0].text
    const result = await chat.sendMessage(lastMessage)
    const responseText = result.response.text()

    return NextResponse.json({ content: responseText })

  } catch (error: any) {
    console.error('Tutor Chat Error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate response',
      details: error.message || String(error)
    }, { status: 500 })
  }
}
