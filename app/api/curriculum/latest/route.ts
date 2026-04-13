import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const studentId = 'user-1' // 향후 세션 처리 시 변경

    const record = await prisma.curriculum.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    })

    if (!record) {
      return NextResponse.json({ curriculum: null })
    }

    // JSON 문자열로 저장되어 있던 phases를 파싱
    const curriculum = {
      title: record.title,
      totalWeeks: record.totalWeeks,
      totalHours: record.totalHours,
      phases: JSON.parse(record.phases),
      aiInsight: record.aiInsight
    }

    return NextResponse.json({ curriculum })
  } catch (error: any) {
    console.error("Latest Curriculum API Error:", error)
    return NextResponse.json({ error: "Failed to fetch top curriculum" }, { status: 500 })
  }
}
