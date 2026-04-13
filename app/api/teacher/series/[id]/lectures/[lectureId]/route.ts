import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateLectureSchema, createQuizSchema, createCodingTestSchema } from '@/lib/validations'
import { ZodError } from 'zod'

interface RouteParams {
  params: Promise<{ id: string; lectureId: string }>
}

/**
 * GET /api/teacher/series/[id]/lectures/[lectureId]
 * Lecture 상세 (Quiz + CodingTest 포함)
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { lectureId } = await params

    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
    })

    if (!lecture) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 })
    }

    return NextResponse.json({ data: lecture })
  } catch (error) {
    console.error('Lecture [lectureId] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/teacher/series/[id]/lectures/[lectureId]
 * Lecture 수정
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { lectureId } = await params
    const body = await req.json()
    const validated = updateLectureSchema.parse(body)

    const lecture = await prisma.lecture.update({
      where: { id: lectureId },
      data: validated,
    })

    return NextResponse.json({ data: lecture })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Lecture [lectureId] PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/teacher/series/[id]/lectures/[lectureId]
 * Lecture 삭제
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { lectureId } = await params
    await prisma.lecture.delete({ where: { id: lectureId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lecture [lectureId] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

