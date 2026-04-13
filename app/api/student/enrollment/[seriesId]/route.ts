import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ seriesId: string }> }
) {
  try {
    const { seriesId } = await params
    const studentId = 'user-1' // 데모 ID

    // 1. 해당 시리즈와 강의들 가져오기
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
      include: {
        lectures: { orderBy: { order: 'asc' } }
      }
    })

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 })
    }

    // 2. 해당 학생의 수강 정보 가져오기
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_seriesId: { studentId, seriesId }
      }
    })

    const completedIds = enrollment?.completedLectureIds ? JSON.parse(enrollment.completedLectureIds) : []
    const totalLectures = series.lectures.length
    const finishedLectures = completedIds.length
    const progressRate = totalLectures === 0 ? 0 : Math.round((finishedLectures / totalLectures) * 100)

    // 3. 현재 수강해야 할 강의 찾기
    const lectures = series.lectures.map((l, idx) => {
      const isCompleted = completedIds.includes(l.id)
      // 완료되지 않은 첫 번째 강의를 '현재(Current)'로 지정
      const isCurrent = !isCompleted && (idx === 0 || completedIds.includes(series.lectures[idx-1]?.id))
      
      return {
        id: l.id,
        title: l.title,
        isCompleted,
        isCurrent,
        type: "video" // 기본값
      }
    })

    // 만약 모든 강의를 다 들었다면 마지막 강의를 Current로 (복습용)
    if (lectures.every(l => l.isCompleted) && lectures.length > 0) {
        lectures[lectures.length - 1].isCurrent = true
    }

    return NextResponse.json({
      seriesId: series.id,
      seriesTitle: series.title,
      description: series.description,
      progressRate,
      lectures
    })

  } catch (error: any) {
    console.error("[Series Detail API] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
