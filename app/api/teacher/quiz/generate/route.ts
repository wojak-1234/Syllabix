import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { buildGenerateQuizPrompt } from '@/lib/prompts'

export async function POST(req: NextRequest) {
  try {
    const { lectureTitle, learningObjective, conceptTags, count = 3 } = await req.json()

    if (!lectureTitle || !learningObjective || !conceptTags) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = buildGenerateQuizPrompt({ lectureTitle, learningObjective, conceptTags, count })
    const model = getGeminiModel({ responseMimeType: "application/json" }, MODELS.STANDARD)
    
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
    console.error('Generate Quiz error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
