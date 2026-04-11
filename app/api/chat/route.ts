import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { messages, codeContext } = await req.json()

    const model = getGeminiModel()

    const systemPrompt = `당신은 'CodeMentor AI'의 소크라테스식 페어 프로그래머입니다.
    
    원칙:
    1. 절대로 직접적인 정답 코드나 해결책을 제공하지 마세요.
    2. 학습자가 스스로 문제를 발견하도록 유도하는 '질문'을 던지세요.
    3. 코드의 특정 부분을 지시하기보다 "이 파일의 3번째 줄에 대해 어떻게 생각하세요?"와 같이 범위를 좁히는 힌트를 주세요.
    4. 학습자가 개념을 모르는 것 같다면 개념을 설명해주되, 코드에 적용하는 것은 학습자의 몫으로 남기세요.
    
    현재 코드 컨텍스트:
    ${codeContext}
    `

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    })

    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(systemPrompt + "\n\n사용자 질문: " + lastMessage)
    
    return NextResponse.json({ message: result.response.text() })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
