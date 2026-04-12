import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSeriesSchema } from '@/lib/validations'
import { ZodError } from 'zod'

/**
 * GET /api/teacher/series
 * 강사의 커리큘럼(Series) 목록 조회
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const teacherId = searchParams.get('teacherId')

    if (!teacherId) {
      return NextResponse.json({ error: 'teacherId is required' }, { status: 400 })
    }

    const seriesList = await prisma.series.findMany({
      where: { teacherId },
      include: {
        lectures: {
          orderBy: { order: 'asc' },
          select: { id: true, title: true, order: true },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ data: seriesList })
  } catch (error) {
    console.error('Series GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/teacher/series
 * 새 Series(커리큘럼) 생성
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = createSeriesSchema.parse(body)

    const series = await prisma.series.create({
      data: {
        teacherId: validated.teacherId,
        title: validated.title,
        description: validated.description,
        targetLevel: validated.targetLevel,
        goal: validated.goal,
        status: 'DRAFT',
        visibility: 'PRIVATE',
      },
    })

    return NextResponse.json({ data: series }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Series POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
