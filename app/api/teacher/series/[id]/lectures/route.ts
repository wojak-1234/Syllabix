import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createLectureSchema, reorderLecturesSchema } from '@/lib/validations'
import { ZodError } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/teacher/series/[id]/lectures
 * Series에 속한 Lecture 목록 조회
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id: seriesId } = await params

    const lectures = await prisma.lecture.findMany({
      where: { seriesId },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ data: lectures })
  } catch (error) {
    console.error('Lectures GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/teacher/series/[id]/lectures
 * 새 Lecture 추가 (order는 자동으로 마지막 순서에 배치)
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: seriesId } = await params
    const body = await req.json()
    const validated = createLectureSchema.parse({ ...body, seriesId })

    // 현재 최대 order 조회
    const lastLecture = await prisma.lecture.findFirst({
      where: { seriesId },
      orderBy: { order: 'desc' },
      select: { order: true },
    })
    const nextOrder = (lastLecture?.order ?? 0) + 1

    const lecture = await prisma.lecture.create({
      data: {
        seriesId: validated.seriesId,
        order: nextOrder,
        title: validated.title,
        learningObjective: validated.learningObjective,
        conceptTags: validated.conceptTags,
        content: validated.content,
        attachmentUrl: validated.attachmentUrl,
      },
    })

    return NextResponse.json({ data: lecture }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Lectures POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/teacher/series/[id]/lectures
 * Lecture 순서 재정렬 (드래그 앤 드롭)
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: seriesId } = await params
    const body = await req.json()
    const validated = reorderLecturesSchema.parse({ ...body, seriesId })

    // 트랜잭션으로 순서 일괄 업데이트
    await prisma.$transaction(
      validated.lectureIds.map((lectureId, index) =>
        prisma.lecture.update({
          where: { id: lectureId },
          data: { order: index + 1 },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Lectures PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
