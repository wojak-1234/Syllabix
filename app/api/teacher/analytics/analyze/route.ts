import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGeminiModel, MODELS } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { seriesId } = await req.json()

    // 1. 해당 시리즈의 모든 강의 정보, 제출 내역, 오답 노트 수집
    const lectures = await prisma.lecture.findMany({
      where: { seriesId },
      include: {
        submissions: { select: { code: true, errorType: true, errorMessage: true, passed: true } },
        errorNotes: { select: { errorType: true, wrongReason: true, relatedConcept: true } }
      }
    })

    if (!lectures.length) {
      return NextResponse.json({ error: "No lectures found for this series." }, { status: 404 })
    }

    // 2. 분석용 데이터 문자열화 (Gemini에게 전달용)
    const analysisContext = lectures.map(l => ({
      lectureTitle: l.title,
      totalSubmissions: l.submissions.length,
      failures: l.submissions.filter(s => !s.passed).map(s => `[${s.errorType}] ${s.errorMessage}`),
      errorPatterns: l.errorNotes.map(en => `${en.relatedConcept}: ${en.wrongReason}`)
    }))

    // 3. Gemini 에이전트 호출
    const model = getGeminiModel(
      { responseMimeType: "application/json", temperature: 0.1 },
      MODELS.PRO
    )

    const prompt = `
[SYSTEM: Syllabix Senior AI Agent]
학습 데이터를 분석해 교사에게 Blind Points(취약점) 통찰과 교수법을 제안하세요.

[데이터]
${JSON.stringify(analysisContext, null, 2)}

[요구사항]
1. Domain Insight: 근본적인 개념 오해(Scope, Memory, Sync/Async 등)를 식별하세요.
2. Output Format: 반드시 다음 JSON 배열 형식을 따르세요.
[{ "id": "unique", "lectureTitle": "강좌명", "concept": "개념명", "failRate": 0-100, "studentDifficulties": ["실수 요약"], "aiDeepFeedback": "교수 가이드", "ragAnchor": "연관 파트" }]
`

    const result = await model.generateContent(prompt)
    const blindPoints = JSON.parse(result.response.text())

    // 4. 분석 결과 DB 저장 (기본 내역 삭제 후 갱신)
    await prisma.$transaction([
      prisma.seriesBlindPoint.deleteMany({ where: { seriesId } }),
      prisma.seriesBlindPoint.createMany({
        data: blindPoints.map((bp: any) => ({
          seriesId,
          concept: bp.concept,
          lectureTitle: bp.lectureTitle,
          failRate: bp.failRate,
          studentDifficulties: JSON.stringify(bp.studentDifficulties),
          aiDeepFeedback: bp.aiDeepFeedback,
          ragAnchor: bp.ragAnchor
        }))
      })
    ])
    
    return NextResponse.json({ blindPoints })

  } catch (error: any) {
    console.error("Agent Analysis API Error:", error)
    return NextResponse.json({ error: "AI 에이전트 분석 중 오류가 발생했습니다." }, { status: 500 })
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const seriesId = searchParams.get('seriesId')

    if (!seriesId) {
      return NextResponse.json({ error: "seriesId is required" }, { status: 400 })
    }

    const savedPoints = await prisma.seriesBlindPoint.findMany({
      where: { seriesId },
      orderBy: { createdAt: 'desc' }
    })

    const blindPoints = savedPoints.map(p => ({
      id: p.id,
      concept: p.concept,
      lectureTitle: p.lectureTitle,
      failRate: p.failRate,
      studentDifficulties: JSON.parse(p.studentDifficulties),
      aiDeepFeedback: p.aiDeepFeedback,
      ragAnchor: p.ragAnchor
    }))

    return NextResponse.json({ blindPoints })
  } catch (error: any) {
    console.error("Fetch Analysis Error:", error)
    return NextResponse.json({ error: "저장된 데이터를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}
