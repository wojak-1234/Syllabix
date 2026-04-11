import { NextRequest, NextResponse } from "next/server"
import { getGeminiModel } from "@/lib/gemini"

/**
 * POST /api/teacher/generate-lecture
 * 
 * Multi-step Chain을 통한 AI 강의 초안 자동 생성
 * Step 1: 목차(Outline) 생성
 * Step 2: 섹션별 설명(Description) 작성
 * Step 3: 진단 문제 세트(Quiz) 출제
 */

// ── JSON 스키마 정의 ──────────────────────────────────────────────────

const outlineSchema = {
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
          keyTopics: { type: "array", items: { type: "string" } }
        },
        required: ["sectionNumber", "title", "learningObjective", "keyTopics"]
      }
    }
  },
  required: ["lectureTitle", "lectureDescription", "targetAudience", "estimatedHours", "sections"]
}

const descriptionsSchema = {
  type: "object",
  properties: {
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sectionNumber: { type: "integer" },
          title: { type: "string" },
          explanation: { type: "string", description: "해당 섹션의 강의 내용을 3~5문단으로 서술" },
          codeExample: { type: "string", description: "핵심 코드 예제 (있을 경우). 마크다운 코드블록 형식." },
          teacherTip: { type: "string", description: "강사가 수업 시 유의할 팁 한 줄" }
        },
        required: ["sectionNumber", "title", "explanation", "teacherTip"]
      }
    }
  },
  required: ["sections"]
}

const quizSchema = {
  type: "object",
  properties: {
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
                label: { type: "string", description: "선택지 내용" },
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
  required: ["quizzes"]
}


export async function POST(req: NextRequest) {
  try {
    const { theme, keywords, difficulty, title } = await req.json()

    console.log(`[LectureGen] Starting multi-step chain for: "${theme}"`)

    // ═══ STEP 1: 목차(Outline) 생성 ═══════════════════════════════════
    console.log("[LectureGen] Step 1/3: Generating outline...")
    
    const outlineModel = getGeminiModel({
      responseMimeType: "application/json",
      // @ts-ignore
      responseSchema: outlineSchema,
      temperature: 0.4,
    })

    const outlinePrompt = `당신은 유명 IT 교육 플랫폼의 커리큘럼 설계 전문가입니다.
    아래 정보를 바탕으로 완벽한 강의 목차를 설계하세요.

    [강의 테마] ${theme}
    [강의 제목] ${title || theme + " 마스터 클래스"}
    [대상 난이도] ${difficulty || "beginner"}
    [핵심 키워드] ${(keywords || []).join(", ")}

    [설계 원칙]
    1. 5~7개의 섹션으로 구성하세요.
    2. 각 섹션은 이전 섹션의 지식을 기반으로 점진적으로 심화되어야 합니다.
    3. 마지막 섹션은 반드시 미니 프로젝트 또는 종합 실습이어야 합니다.
    4. 모든 내용은 한국어로 응답하세요.`

    const outlineResult = await outlineModel.generateContent(outlinePrompt)
    const outline = JSON.parse(outlineResult.response.text())

    console.log(`[LectureGen] Step 1 complete: ${outline.sections?.length} sections`)


    // ═══ STEP 2: 섹션별 설명(Description) 작성 ═══════════════════════
    console.log("[LectureGen] Step 2/3: Writing descriptions...")

    const descModel = getGeminiModel({
      responseMimeType: "application/json",
      // @ts-ignore
      responseSchema: descriptionsSchema,
      temperature: 0.5,
      maxOutputTokens: 8192,
    })

    const outlineSummary = outline.sections
      .map((s: any) => `섹션 ${s.sectionNumber}. ${s.title} (목표: ${s.learningObjective}, 주제: ${s.keyTopics.join(", ")})`)
      .join("\n")

    const descPrompt = `당신은 실력있는 IT 강사입니다. 아래 강의 목차의 각 섹션에 대해 상세한 강의 내용을 작성하세요.

    [강의 정보]
    - 제목: ${outline.lectureTitle}
    - 대상: ${outline.targetAudience}
    - 난이도: ${difficulty || "beginner"}

    [목차]
    ${outlineSummary}

    [작성 지침]
    1. 각 섹션마다 3~5문단의 교육 내용(explanation)을 작성하세요. 학생에게 설명하듯 친절하게.
    2. 코드가 필요한 섹션은 codeExample에 마크다운 코드블록으로 핵심 코드를 넣으세요.
    3. teacherTip에는 강사가 수업 시 특히 강조해야 할 포인트를 한 줄로 적으세요.
    4. 모든 내용은 한국어로 응답하세요.`

    const descResult = await descModel.generateContent(descPrompt)
    const descriptions = JSON.parse(descResult.response.text())

    console.log(`[LectureGen] Step 2 complete: ${descriptions.sections?.length} descriptions`)


    // ═══ STEP 3: 진단 문제 세트(Quiz) 출제 ═══════════════════════════
    console.log("[LectureGen] Step 3/3: Generating quiz set...")

    const quizModel = getGeminiModel({
      responseMimeType: "application/json",
      // @ts-ignore
      responseSchema: quizSchema,
      temperature: 0.3,
    })

    const contentSummary = descriptions.sections
      .map((s: any) => `[섹션 ${s.sectionNumber}: ${s.title}] ${s.explanation.substring(0, 200)}...`)
      .join("\n")

    const quizPrompt = `당신은 교육 평가 설계 전문가입니다. 아래 강의 내용을 기반으로 진단 문제 세트를 출제하세요.

    [강의 제목] ${outline.lectureTitle}
    [강의 내용 요약]
    ${contentSummary}

    [출제 지침]
    1. 총 5~7문제를 출제하세요 (4지선다형).
    2. 각 문제는 특정 섹션과 연관되어야 하며, relatedSection에 해당 섹션 번호를 명시하세요.
    3. 난이도를 easy(2문제), medium(2~3문제), hard(1~2문제)로 균형 있게 배분하세요.
    4. 단순 암기가 아닌, 개념의 이해와 적용력을 평가하는 문제로 구성하세요.
    5. 각 문제의 정답 해설(explanation)을 친절하게 작성하세요.
    6. options의 label에는 'A', 'B' 같은 기호가 아닌 실제 내용을 넣으세요.
    7. 모든 내용은 한국어로 응답하세요.`

    const quizResult = await quizModel.generateContent(quizPrompt)
    const quizSet = JSON.parse(quizResult.response.text())

    console.log(`[LectureGen] Step 3 complete: ${quizSet.quizzes?.length} quizzes`)
    console.log("[LectureGen] ✅ Multi-step chain completed successfully!")


    // ═══ 최종 응답: 3단계 결과 통합 ═══════════════════════════════════
    return NextResponse.json({
      success: true,
      lecture: {
        ...outline,
        sections: outline.sections.map((sec: any) => {
          const desc = descriptions.sections?.find((d: any) => d.sectionNumber === sec.sectionNumber)
          return {
            ...sec,
            explanation: desc?.explanation || "",
            codeExample: desc?.codeExample || "",
            teacherTip: desc?.teacherTip || ""
          }
        }),
        quizzes: quizSet.quizzes || []
      }
    })

  } catch (error: any) {
    console.error("[LectureGen] Chain error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
