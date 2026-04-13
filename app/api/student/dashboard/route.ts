import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGeminiModel, MODELS } from '@/lib/gemini'
import { ApiCache } from '@/lib/cache'

export async function GET() {
  try {
    // [데모용] 커리큘럼 생성 및 수락 시 사용되는 'user-1' ID로 통일
    const studentId = 'user-1'
    const recommendations: any[] = []

    // ── 0. 공개된 강좌 풀 미리 확보 ──
    const allPublished = await prisma.series.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        teacher: true,
        _count: { select: { lectures: true } }
      }
    })

    // 1. 내 수강 내역 (Enrollments)
    const enrollmentsRecords = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        series: {
          include: {
            lectures: { orderBy: { order: 'asc' } },
            teacher: true
          }
        }
      }
    })

    const enrollments = enrollmentsRecords.map(en => {
      const series = en.series
      const totalLectures = series.lectures.length
      const completedIds = en.completedLectureIds ? JSON.parse(en.completedLectureIds) : []
      const finishedLectures = completedIds.length
      const progressRate = totalLectures === 0 ? 0 : Math.round((finishedLectures / totalLectures) * 100)

      // 아직 안 들은 첫 번째 강의를 "다음 학습"으로 지정, 다 들었다면 마지막 강의
      let nextLecture = series.lectures.find(l => !completedIds.includes(l.id))
      if (!nextLecture && series.lectures.length > 0) {
        nextLecture = series.lectures[series.lectures.length - 1]
      }

      return {
        id: en.id,
        seriesId: en.seriesId,
        seriesTitle: series.title,
        progressRate,
        lastLectureTitle: nextLecture ? nextLecture.title : '등록된 강의 없음',
        totalLectures,
        finishedLectures
      }
    })

    // 2. 가장 최근 수락한 커리큘럼 정보 가져오기
    const curriculumRecord = await prisma.curriculum.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    })

    const curriculum = curriculumRecord ? {
      title: curriculumRecord.title,
      phases: JSON.parse(curriculumRecord.phases)
    } : null

    return NextResponse.json({ enrollments, recommendations, curriculum })
  } catch (error: any) {
    console.error("Student Dashboard DB Error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
