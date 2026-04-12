import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateSeriesSchema } from '@/lib/validations'
import { ZodError } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/teacher/series/[id]
 * Series 상세 조회 (Lectures 포함)
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const series = await prisma.series.findUnique({
      where: { id },
      include: {
        lectures: {
          orderBy: { order: 'asc' },
          include: {
            quizzes: { select: { id: true, question: true, order: true } },
            codingTests: { select: { id: true, title: true, order: true } },
          },
        },
        _count: { select: { enrollments: true } },
      },
    })

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    return NextResponse.json({ data: series })
  } catch (error) {
    console.error('Series [id] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/teacher/series/[id]
 * Series 수정 (제목, 설명, 상태, 공개 설정 등)
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await req.json()
    const validated = updateSeriesSchema.parse(body)

    const series = await prisma.series.update({
      where: { id },
      data: validated,
    })

    return NextResponse.json({ data: series })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Series [id] PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/teacher/series/[id]
 * Series 삭제 (Cascade: 하위 Lecture, Quiz, CodingTest 모두 삭제)
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    await prisma.series.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Series [id] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
