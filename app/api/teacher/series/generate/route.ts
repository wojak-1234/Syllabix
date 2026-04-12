import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { buildGenerateSeriesPrompt } from '@/lib/prompts'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const teacherId = body.teacherId || "mock-teacher-id"
    const title = body.title || ""
    const description = body.description || ""
    const targetLevel = body.targetLevel || "beginner"

    // AI 페르소나 및 세세한 제약이 포함된 프롬프트 생성 (One Query 단일 호출)
    const prompt = buildGenerateSeriesPrompt({ title, description, targetLevel })
    
    // Gemini 3.0 Pro 모델 적용
    const model = getGeminiModel({ responseMimeType: 'application/json' }, MODELS.PRO)
    const result = await model.generateContent(prompt)
    let aiResponse = result.response.text()
    
    console.log("=== AI Raw Response ===")
    console.log(aiResponse)
    console.log("=========================")
    
    // 1. 제어 문자 및 불필요한 공백 제거 (JSON 파싱 에러 방지)
    aiResponse = aiResponse.trim();
    
    // 2. 마크다운 코드 블록 제거
    aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();

    let aiData;
    try {
        // 3. 가장 바깥쪽의 { ... } 블록 추출
        const firstOpen = aiResponse.indexOf('{');
        const lastClose = aiResponse.lastIndexOf('}');
        
        if (firstOpen === -1 || lastClose === -1 || lastClose <= firstOpen) {
            throw new Error("유효한 JSON 블록을 찾을 수 없습니다.");
        }
        
        const cleanJson = aiResponse.substring(firstOpen, lastClose + 1)
            .replace(/[\x00-\x1F\x7F-\x9F]/g, ""); // 비공개 제어 문자 제거
            
        aiData = JSON.parse(cleanJson);
    } catch (e: any) {
        console.error("JSON Parse Detail Help:", e.message);
        console.error("Failing JSON fragment:", aiResponse.substring(0, 100) + "...");
        throw new Error("AI 응답 데이터 파싱 실패: " + e.message);
    }
    
    // 실제 DB 연동 (아직 DB 회원 정보가 없는 초기화를 위한 Mock 유저 취급)
    let user = await prisma.user.findUnique({ where: { id: teacherId }})
    if (!user) {
        user = await prisma.user.create({
            data: { id: teacherId, email: "teacher@example.com", name: "홍길동", role: "TEACHER" }
        })
    }

    // 커리큘럼 및 하위 강좌 DB 일괄 생성 (트랜잭션)
    const series = await prisma.series.create({
      data: {
        teacherId: user.id,
        title: aiData.title || title,
        description: aiData.description || description,
        targetLevel: targetLevel,
        goal: "",
        status: 'DRAFT',
        visibility: 'PRIVATE',
        lectures: {
          create: (aiData.lectures || []).map((l: any, i: number) => ({
            order: i + 1,
            title: l.title,
            learningObjective: l.learningObjective,
            conceptTags: JSON.stringify(l.conceptTags || []),
            attachmentUrl: l.attachmentUrl || null
          }))
        }
      },
      include: {
        lectures: true
      }
    })

    return NextResponse.json({ data: series }, { status: 201 })
  } catch (error) {
    console.error('Generate Series error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
