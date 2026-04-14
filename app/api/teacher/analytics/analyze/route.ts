import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGeminiModel, MODELS } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { seriesId } = await req.json()

    if (!seriesId) {
      return NextResponse.json({ error: "분석할 강좌(시리즈) ID가 누락되었습니다." }, { status: 400 })
    }

    // 1. 해당 시리즈의 모든 강의 정보, 제출 내역, 오답 노트 수집
    const lectures = await prisma.lecture.findMany({
      where: { seriesId },
      include: {
        submissions: { select: { code: true, errorType: true, errorMessage: true, passed: true } },
        errorNotes: { select: { errorType: true, wrongReason: true, relatedConcept: true } }
      }
    })

    if (!lectures || lectures.length === 0) {
      return NextResponse.json({ error: "이 강좌에 등록된 강의가 없거나 분석할 데이터가 부족합니다." }, { status: 404 })
    }

    // 2. 분석용 데이터 문자열화 (Gemini에게 전달용)
    const analysisContext = lectures.map(l => ({
      lectureTitle: l.title,
      totalSubmissions: l.submissions.length,
      failures: l.submissions.filter(s => !s.passed).map(s => `[${s.errorType}] ${s.errorMessage}`),
      errorPatterns: l.errorNotes.map(en => `${en.relatedConcept}: ${en.wrongReason}`)
    }))

    // 3. Gemini 에이전트 호출
    let aiText
    try {
       const model = getGeminiModel(
         { responseMimeType: "application/json", temperature: 0.1 },
         MODELS.PRO
       )
   
       const prompt = `
[SYSTEM: Syllabix Senior AI Learning Agent]
당신은 학생들의 코딩 학습 데이터를 분석하여 교사에게 통찰을 제공하는 전문 교육 에이전트입니다.
제공된 [데이터 컨텍스트]를 바탕으로 학생들이 공통적으로 겪는 'Blind Points(취약점)'를 식별하고 교수법을 제안하세요.

[데이터 컨텍스트]
강좌 정보 및 오답 데이터:
${JSON.stringify(analysisContext, null, 2)}

[요구사항]
1. Domain Insight: 단순 문법 에러 말고, 근본적인 프로그래밍 개념의 오해(예: Scope, Memory, Sync/Async 등)를 찾아내세요.
2. Output Format: 반드시 다음 JSON 배열 형식을 따르세요. (마크다운 태그 없이 순수 JSON만 반환)
[
  {
    "id": "아이디(unique)",
    "lectureTitle": "해당 문제가 발생하는 대표 강의명",
    "concept": "취약 개념명",
    "failRate": 실패율(숫자, 0-100),
    "studentDifficulties": ["학생들이 구체적으로 어떤 말을 하거나 어떤 실수를 하는지 요약 문장들"],
    "aiDeepFeedback": "강사가 이 취약점을 해결하기 위해 취해야 할 구체적인 교수 전략 가이드",
    "ragAnchor": "강의 본문 내용 중 어떤 파트와 연관성이 큰지(RAG 검색 시뮬레이션)"
  }
]
`
       const result = await model.generateContent(prompt)
       aiText = result.response.text()
    } catch (genError: any) {
       console.error("Gemini Generation API Error:", genError)
       return NextResponse.json({ error: "AI 에이전트 분석 생성 실패: " + (genError.message || "Unknown Error") }, { status: 500 })
    }

    // JSON 파싱 전 마크다운 코드 블록 제거
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim()
    
    let blindPoints
    try {
      blindPoints = JSON.parse(aiText)
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiText)
      return NextResponse.json({ error: "AI 분석 데이터 형식을 파싱하는 데 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ blindPoints })

  } catch (error: any) {
    console.error("Agent Analysis API Error:", error)
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 })
  }
}
