import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { studentId, lectureId } = await req.json()

    // 1. 데이터베이스에서 학생의 프로파일과 강의 메타데이터 조회
    // 실제 환경에서는 DB에서 조회하지만, 현재는 데모용 Mock 데이터 또는 null 대비 처리를 합니다.
    const student = await prisma.user.findUnique({
      where: { id: studentId || "user-1" },
      select: { studentLevel: true, blunderList: true, accuracyRate: true }
    }) || { studentLevel: 'Beginner', blunderList: '["SyntaxError"]', accuracyRate: 0.5 };

    // 1.5 해당 강의가 속한 시리즈의 전체 목차(Table of Contents) 조회
    let tableOfContents = "";
    if (lectureId) {
      const lectureWithSeries = await prisma.lecture.findUnique({
        where: { id: lectureId },
        include: { 
          series: { 
            include: { lectures: { orderBy: { order: 'asc' }, select: { title: true } } } 
          } 
        }
      });
      
      if (lectureWithSeries?.series) {
        tableOfContents = lectureWithSeries.series.lectures
          .map((l, i) => `${i + 1}. ${l.title}`)
          .join("\n");
      }
    }

    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId || "l1" },
      select: { title: true, learningObjective: true, conceptTags: true, content: true, aiFocusPoints: true }
    }) || { 
      title: "Python 기초", 
      learningObjective: "변수와 반복문 이해", 
      conceptTags: "['Loop']",
      content: "파이썬의 for문을 활용하여 배열을 순회하는 법을 배웁니다.",
      aiFocusPoints: "for문과 range() 함수의 결합에 집중하여 평가해주세요."
    };

    // 2. Gemini를 사용한 개인화 문제 생성
    const model = getGeminiModel(
      { responseMimeType: "application/json", temperature: 0.2 }, // Harness Engineering: 창의성(환각) 억제 및 예측 가능성 향상
      MODELS.PRO 
    )

    const prompt = `
[SYSTEM: Syllabix Personalized Assessment Engine]
당신은 코딩 교육 플랫폼의 개인화 문제 출제 AI입니다.
반드시 [강의 정보]의 주제 안에서만 문제를 출제해야 하며, 전체 교육 과정(${lecture.title}가 포함된 목차)의 흐름을 이해하여 이전 단계의 내용을 복습하거나 현재 단계의 핵심을 찌르는 문제를 생성하세요.

[SERIES CONTEXT: 전체 강좌 목차]
${tableOfContents || "정보 없음"}

[LECTURE CONTEXT: 현재 강의 정보]
- 강좌명: ${lecture.title}
- 학습 목표: ${lecture.learningObjective}
- 핵심 개념: ${lecture.conceptTags}
- 강의 본문 요약:
${lecture.content || '본문 없음'}

[TEACHER'S INSTRUCTION: 강사의 집중 프롬프트 가이드]
이 지시사항은 절대적으로 준수해야 합니다:
${lecture.aiFocusPoints || '제공된 가이드 없음. 강의 본문과 핵심 개념에만 충실하게 출제할 것.'}

[STUDENT PROFILE: 학생 상태]
- 현재 수준: ${student.studentLevel || 'Beginner'}
- 고질적 실수 유형(Blunder List): ${student.blunderList || '없음'}
- 전체 정답률: ${student.accuracyRate * 100}%

[HARNESS CONSTRAINTS & OUTPUT GUIDELINES]
1. Domain Constraint: 강좌명(${lecture.title}) 및 수록된 학습 목표와 완전히 직결된 상황만 문제로 사용하세요.
2. Difficulty Constraint: 학생 전체 정답률(${student.accuracyRate * 100}%)에 맞춰 기본기 검증(정답률 낮을 시) 또는 응용(정답률 높을 시)을 선택하세요.
3. Tutor's Trap: 학생의 고질적 실수(${student.blunderList})가 있는 경우, 이를 짚고 넘어갈 수 있는 함정을 문제에 배치하되 너무 가혹하지 않게 조절하세요.
4. Output Format: 반드시 아래 JSON 스키마를 따르는 순수 JSON 객체 1개만 반환하세요.
{
  "title": "강의 주제에 맞는 흥미로운 문제 제목",
  "description": "문제 설명 (일반 텍스트, 줄바꿈은 \\n 사용, 구체적인 요구사항 포함)",
  "starterCode": "문제 해결을 위한 파이썬 기반 코드 (def solution(...): 등)",
  "testCases": [{"input": "파이썬 문법의 변수 할당문 (예: df = pd.DataFrame(...))", "expectedOutput": "기대되는 리턴값 또는 출력 문자열"}],
  "maxAttempts": 3
}
`

    // 3. 지능형 재시도(Retry) 로직 구현
    let result;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        result = await model.generateContent(prompt)
        break; // 성공 시 루프 탈출
      } catch (err: any) {
        attempts++;
        console.warn(`[AI Retry] Attempt ${attempts} failed: ${err.message}`);
        
        // 503 에러 또는 일시적 네트워크 에러인 경우에만 재시도
        if (attempts < maxAttempts && (err.status === 503 || err.message?.includes('503'))) {
          const delay = attempts * 2000; // 2초, 4초 점진적 대기
          console.log(`[AI Retry] Retrying in ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw err; // 최대 시도 횟수 초과 또는 다른 에러 시 throw
        }
      }
    }

    if (!result) throw new Error("AI generation failed after retries")

    const responseText = result.response.text()
    
    let generatedTest
    try {
      generatedTest = JSON.parse(responseText)
    } catch (e) {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
      generatedTest = jsonMatch ? JSON.parse(jsonMatch[1]) : null
    }

    if (!generatedTest) throw new Error("Failed to parse AI generated test")

    return NextResponse.json({ data: generatedTest })

  } catch (error: any) {
    console.error('Generate Test Error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate personalized test', 
      details: error.message || String(error) 
    }, { status: 500 })
  }
}
