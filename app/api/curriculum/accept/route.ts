import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const studentId = 'user-1' // 데모 ID
    const { phases } = await req.json()

    if (!phases || !Array.isArray(phases)) {
      return NextResponse.json({ error: "Invalid phases data" }, { status: 400 })
    }

    // 1. 커리큘럼 내 모든 추천 강좌 ID 추출
    const seriesIds: string[] = []
    phases.forEach((phase: any) => {
      if (phase.linkedCourses) {
        phase.linkedCourses.forEach((c: any) => {
          if (c.id) seriesIds.push(c.id)
        })
      }
    })

    const uniqueSeriesIds = Array.from(new Set(seriesIds))

    if (uniqueSeriesIds.length === 0) {
      return NextResponse.json({ message: "No courses to enroll" })
    }

    // 2. 각 강좌에 대해 Enrollment 생성 (이미 있으면 무시)
    const enrollmentResults = await Promise.all(
      uniqueSeriesIds.map(async (sid) => {
        return prisma.enrollment.upsert({
          where: {
            studentId_seriesId: { studentId, seriesId: sid }
          },
          update: {}, // 이미 수강 중이면 별도 조치 안 함
          create: {
            studentId,
            seriesId: sid,
            progress: 0,
            completedLectureIds: "[]"
          }
        })
      })
    )

    return NextResponse.json({ 
      success: true, 
      count: enrollmentResults.length,
      message: `${enrollmentResults.length}개의 강좌 수강 신청이 완료되었습니다.` 
    })

  } catch (error: any) {
    console.error("[Curriculum Accept API] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
