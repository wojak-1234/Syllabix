import { NextRequest, NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/gemini"
import { ApiCache } from "@/lib/cache"

/**
 * POST /api/teacher/generate-lecture
 * 
 * Multi-step Chain을 통한 AI 강의 초안 자동 생성
 * Step 1: 목차(Outline) 생성
 * Step 2: 섹션별 설명(Description) 작성
 * Step 3: 진단 문제 세트(Quiz) 출제
 */

// ── JSON 스키마 정의 ──────────────────────────────────────────────────

const lectureSchema = {
  type: "object",
  properties: {
    lectureTitle: { type: "string", description: "강의 전체 제목" },
    lectureDescription: { type: "string", description: "강의 한줄 소개 (2~3문장)" },
    targetAudience: { type: "string", description: "대상 수강생 (예: React 입문자)" },
    estimatedHours: { type: "integer", description: "예상 총 학습 시간" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sectionNumber: { type: "integer" },
          title: { type: "string" },
          learningObjective: { type: "string", description: "이 섹션의 학습 목표 한 줄" },
          keyTopics: { type: "array", items: { type: "string" } },
          explanation: { type: "string", description: "해당 섹션의 강의 내용을 3~5문단으로 서술. 학생에게 설명하듯 친절하게." },
          codeExample: { type: "string", description: "핵심 코드 예제 (있을 경우). 마크다운 코드블록 형식." },
          teacherTip: { type: "string", description: "강사가 수업 시 유의할 팁 한 줄" }
        },
        required: ["sectionNumber", "title", "learningObjective", "keyTopics", "explanation", "teacherTip"]
      }
    },
    quizzes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          questionNumber: { type: "integer" },
          relatedSection: { type: "integer", description: "연관된 섹션 번호" },
          question: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string", description: "실제 선택지 내용" },
                isCorrect: { type: "boolean" }
              },
              required: ["label", "isCorrect"]
            }
          },
          explanation: { type: "string", description: "정답 해설" },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
        },
        required: ["questionNumber", "relatedSection", "question", "options", "explanation", "difficulty"]
      }
    }
  },
  required: ["lectureTitle", "lectureDescription", "targetAudience", "estimatedHours", "sections", "quizzes"]
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { theme, keywords, difficulty, title } = body

    // 1. 캐시 키 생성 및 조회
    const cacheKey = ApiCache.generateKey('lecture', { theme, keywords, difficulty, title })
    const cachedData = ApiCache.get(cacheKey)

    if (cachedData) {
      console.log(`[LectureGen] Returning CACHED response for: "${theme}"`)
      return NextResponse.json({ success: true, lecture: cachedData, cached: true })
    }

    console.log(`[LectureGen] Starting optimized single-shot generation for: "${theme}"`)

    const model = getGeminiModel({
      responseMimeType: "application/json",
      // @ts-ignore
      responseSchema: lectureSchema,
      temperature: 0.5,
      maxOutputTokens: 8192,
    })

    const prompt = `당신은 IT 커리큘럼 전문가 및 실력있는 강사입니다. 
    아래 정보를 바탕으로 **가장 완벽한 형태의 통합 강의 초안(목차, 섹션별 설명, 진단 퀴즈 세트)**을 한 번에 설계하세요.

    [강의 기초 정보]
    - 강의 테마: ${theme}
    - 강의 제목: ${title || theme + " 마스터 클래스"}
    - 대상 난이도: ${difficulty || "beginner"}
    - 핵심 키워드: ${(keywords || []).join(", ")}

    [작성 지침 - Sections (목차 및 내용)]
    1. 전체 5~7개의 섹션으로 구성하세요.
    2. 각 섹션은 점진적으로 심화되고, 마지막 섹션은 실습 위주로 구성하세요.
    3. 각 섹션별로 3~5문단 분량의 구체적인 교육 내용(explanation)을 친절하게 작성하세요.
    4. 코드가 필요한 경우 codeExample 필드에 마크다운 블록으로 코드를 작성하세요.
    5. 강사를 위한 수업 진행 팁(teacherTip)을 한 줄 작성하세요.

    [작성 지침 - Quizzes (진단 문제 세트)]
    1. 작성된 강의 내용을 바탕으로 총 5~7문제(4지선다형)를 출제하세요.
    2. 각 문제는 특정 섹션(relatedSection)과 연관되어야 합니다.
    3. 난이도를 easy(2구문), medium(2~3문항), hard(1~2문항) 수준으로 적절히 섞어 출제하세요.
    4. 각 선택지의 label은 'A/B/C/D' 가 아닌 실제 내용을 작성하세요.
    
    모든 데이터는 한국어로 응답해야 합니다.`

    const result = await model.generateContent(prompt)
    const lectureData = JSON.parse(result.response.text())

    console.log(`[LectureGen] Single-shot generation complete. Sections: ${lectureData.sections?.length}, Quizzes: ${lectureData.quizzes?.length}`)

    // 2. 새로운 결과 캐싱 (기본 1시간)
    ApiCache.set(cacheKey, lectureData)

    return NextResponse.json({
      success: true,
      lecture: lectureData,
      cached: false
    })

  } catch (error: any) {
    console.error("[LectureGen] Generation error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
