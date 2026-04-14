import { NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { 
      code, 
      questionTitle, 
      questionDescription, 
      attempts,
      studentId,      
      lectureId,
      codingTestId
    } = await request.json()

    const targetLectureId = lectureId || codingTestId || "l1"

    if (code === undefined) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    // 1. AI 평가 수행
    const model = getGeminiModel(
      { responseMimeType: "application/json" },
      MODELS.STANDARD
    )

    const prompt = `
 당신은 학생들의 프로그래밍 코드를 분석하고 피드백을 주는 따뜻하고 완전 전문적인 AI 튜터입니다.
 학생이 다음 문제에 대해 파이썬 코드를 작성했습니다.
 
 [문제 제목]: ${questionTitle}
 [문제 설명]: ${questionDescription}
 [작성한 코드]: 
 \`\`\`python
 ${code}
 \`\`\`
 [시도 횟수]: ${attempts + 1}회
 
 학생의 코드를 검토하고 결과를 JSON으로 반환하세요.
 1. isCorrect (boolean): 정답 여부
 2. feedback (string): 친절한 힌트 (정답을 바로 주지 말 것)
 3. errorType (string): 틀렸다면 에러 유형 (SyntaxError, LogicError, TypeError, none 중 선택)
 4. wrongReason (string): 틀린 이유에 대한 짧은 요약
 5. conceptTag (string): 이 문제와 관련된 핵심 프로그래밍 개념 (예: "Closure", "Loop", "Indexing")

 { "isCorrect": boolean, "feedback": "string", "errorType": "string", "wrongReason": "string", "conceptTag": "string" }
`
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    let aiResult
    try {
      aiResult = JSON.parse(responseText)
    } catch (e) {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
      aiResult = jsonMatch ? JSON.parse(jsonMatch[1]) : { isCorrect: false, feedback: "분석 실패", errorType: "RuntimeError", wrongReason: "AI 응답 파싱 실패", conceptTag: "Unknown" }
    }

    // 실제 운영 시에는 auth session과 현재 강좌 맥락에서 가져오지만 여기서는 전달받은 것을 사용
    const targetStudentId = studentId || "user-1" 
    // targetLectureId는 상단에서 이미 계산됨 (lectureId || codingTestId || "l1")

    try {
      const submission = await prisma.submission.create({
        data: {
          studentId: targetStudentId,
          lectureId: targetLectureId,
          dynamicQuestionTitle: questionTitle,
          dynamicQuestionDescription: questionDescription,
          attemptNumber: attempts + 1,
          code: code,
          passed: aiResult.isCorrect,
          errorType: aiResult.errorType,
          errorMessage: aiResult.wrongReason,
          aiHint: aiResult.feedback
        }
      })

      // [오답 노트 및 취약점 분석 연동]
      // 3회 실패하거나 틀렸을 때 오답 노트를 생성/업데이트
      if (!aiResult.isCorrect) {
         await prisma.errorNote.create({
           data: {
             studentId: targetStudentId,
             lectureId: targetLectureId,
             problemTitle: questionTitle,
             errorType: aiResult.errorType,
             wrongReason: aiResult.wrongReason,
             relatedConcept: aiResult.conceptTag,
             attemptCount: attempts + 1,
             codeSnapshots: JSON.stringify([code])
           }
         })

         // BlindPoint (취약점) 생성 - AI가 개념적 결핍을 느꼈을 경우
         await prisma.blindPoint.create({
           data: {
             userId: targetStudentId,
             concept: aiResult.conceptTag,
             confidence: 0.85,
             evidence: `코딩테스트 시도 중 ${aiResult.errorType} 발생: ${aiResult.wrongReason}`,
             suggestedAction: `${aiResult.conceptTag}에 대한 기초 강의 재수강 및 예제 풀이 권장`
           }
         })
      }
    } catch (dbError) {
      console.warn('DB Save Warning (Ignored for evaluation):', dbError)
      // 외래키 에러 등 DB 저장 실패에도 프론트엔드 평가는 정상 반환되도록 패스합니다.
    }

    return NextResponse.json(aiResult)

  } catch (error: any) {
    console.error('Error in evaluation:', error)
    return NextResponse.json({ 
      error: 'Failed to evaluate code', 
      details: error.message || String(error) 
    }, { status: 500 })
  }
}
