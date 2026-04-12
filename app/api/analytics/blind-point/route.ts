import { NextRequest, NextResponse } from 'next/server'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"

// 1. LangChain을 사용한 정형화된 출력 스키마 정의
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    identifiedVulnerabilities: z.array(z.object({
      concept: z.string().describe("취약 개념 이름"),
      confidence: z.number().describe("확신도 (0-1)"),
      evidenceReason: z.string().describe("취약하다고 판단한 근거"),
      suggestedReviewSection: z.string().describe("보충 학습이 필요한 강의 구간")
    })),
    isCurriculumResetNeeded: z.boolean().describe("커리큘럼 재구성이 필요한지 여부"),
    actionPlan: z.string().describe("강사를 위한 구체적인 액션 플랜")
  })
)

export async function POST(req: NextRequest) {
  try {
    const { userActivityLog } = await req.json()

    // 2. LangChain ChatGoogleGenerativeAI 인스턴스 생성
    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-flash",
      maxOutputTokens: 2048,
      apiKey: process.env.GEMINI_API_KEY,
    })

    // 3. 랑체인 프롬프트 템플릿 구성
    const prompt = new PromptTemplate({
      template: `학습자의 활동 로그를 분석하여 '모르는 줄 모르는' 취약 개념(Blind Points)을 찾아내고 정해진 형식에 맞춰 답변하세요.
      
      {format_instructions}
      
      활동 로그:
      {activity_log}
      
      분석 기준:
      1. 동일 키워드 반복 오답
      2. IDE 실습 내 논리적 방황 구간 추적
      3. RAG 기반 강의 텍스트와 매칭되는 취약점 추출`,
      inputVariables: ["activity_log"],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    })

    const input = await prompt.format({
      activity_log: JSON.stringify(userActivityLog, null, 2),
    })

    // 4. Chain 실행
    const response = await model.invoke(input)
    
    // 5. 출력 파싱
    const result = await parser.parse(response.content as string)
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[LangChain Agent Error]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
