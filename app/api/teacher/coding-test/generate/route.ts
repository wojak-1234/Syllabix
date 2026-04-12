import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { buildGenerateCodingTestPrompt } from '@/lib/prompts'

export async function POST(req: NextRequest) {
  try {
    const { lectureTitle, learningObjective, conceptTags } = await req.json()

    if (!lectureTitle || !learningObjective || !conceptTags) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 성능과 구조적 생성을 위해 PRO 모델 사용 (API_OPTIMIZATION_PLAN.md 방침 적용)
    const prompt = buildGenerateCodingTestPrompt({ lectureTitle, learningObjective, conceptTags })
    const model = getGeminiModel({ responseMimeType: "application/json" }, MODELS.PRO)
    
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    let generatedData;
    try {
      generatedData = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse AI response:', responseText)
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

    return NextResponse.json({ data: generatedData })

  } catch (error) {
    console.error('Generate CodingTest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
