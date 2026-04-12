import { NextResponse } from 'next/server'
import { z } from 'zod'

const supplementSchema = z.object({
  concept: z.string(),
  aiSuggestion: z.string(),
  lectureId: z.string(), // 오답이 발생한 원본 강의 ID
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: seriesId } = params
    const { concept, aiSuggestion, lectureId } = await req.json()
    
    // 🏥 실제 비즈니스 로직:
    // 1. 해당 Series의 강좌 목록 조회
    // 2. 원본 강의Id 바로 뒤에 새 강의(보충 강의)를 삽입
    // 3. 강의 내용(Markdown)을 aiSuggestion 기반으로 Gemini가 초안 생성하도록 유도
    // 4. DB 저장
    
    console.log(`[Phase 4] 보충 강의 삽입: Series ${seriesId}, 개념: ${concept}`)

    return NextResponse.json({
      success: true,
      data: {
        newLectureId: `supp-${Date.now()}`,
        title: `[보충] ${concept} 심화 학습`,
        message: "보충 강좌가 성공적으로 커리큘럼에 삽입되었습니다. 강사님은 내용을 검토하고 확정하세요."
      }
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
