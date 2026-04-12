import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/student/enrollments
 * 학생의 수강 중인 Series 목록 반환
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 })
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        series: {
          include: {
            _count: { select: { lectures: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ data: enrollments })
  } catch (error) {
    console.error('Enrollments GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/student/enrollments
 * 특정 Series에 수강 신청 (오프라인 결제/무료 등록 모사)
 */
export async function POST(req: NextRequest) {
  try {
    const { studentId, seriesId } = await req.json()

    if (!studentId || !seriesId) {
      return NextResponse.json({ error: 'studentId and seriesId are required' }, { status: 400 })
    }

    // 중복 방지
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_seriesId: { studentId, seriesId }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 })
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        seriesId,
        progressRate: 0,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ data: enrollment }, { status: 201 })
  } catch (error) {
    console.error('Enrollments POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
