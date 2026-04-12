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
      include: {
        quizzes: { orderBy: { order: 'asc' } },
        codingTests: { orderBy: { order: 'asc' } },
      },
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

/**
 * POST /api/teacher/series/[id]/lectures/[lectureId]
 * Quiz 또는 CodingTest 추가 (body.type으로 분기)
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { lectureId } = await params
    const body = await req.json()
    const type = body.type as 'quiz' | 'codingTest'

    if (type === 'quiz') {
      const validated = createQuizSchema.parse({ ...body, lectureId })
      const lastQuiz = await prisma.quiz.findFirst({
        where: { lectureId },
        orderBy: { order: 'desc' },
        select: { order: true },
      })

      const quiz = await prisma.quiz.create({
        data: {
          lectureId: validated.lectureId,
          order: (lastQuiz?.order ?? 0) + 1,
          question: validated.question,
          choices: validated.choices,
          explanation: validated.explanation,
          conceptTag: validated.conceptTag,
        },
      })
      return NextResponse.json({ data: quiz }, { status: 201 })
    }

    if (type === 'codingTest') {
      const validated = createCodingTestSchema.parse({ ...body, lectureId })
      const lastTest = await prisma.codingTest.findFirst({
        where: { lectureId },
        orderBy: { order: 'desc' },
        select: { order: true },
      })

      const codingTest = await prisma.codingTest.create({
        data: {
          lectureId: validated.lectureId,
          order: (lastTest?.order ?? 0) + 1,
          title: validated.title,
          description: validated.description,
          starterCode: validated.starterCode,
          testCases: validated.testCases,
          solutionCode: validated.solutionCode,
          gradingCriteria: validated.gradingCriteria,
          conceptTag: validated.conceptTag,
        },
      })
      return NextResponse.json({ data: codingTest }, { status: 201 })
    }

    return NextResponse.json({ error: 'type must be "quiz" or "codingTest"' }, { status: 400 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Lecture [lectureId] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
