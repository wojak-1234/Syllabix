import { z } from 'zod'

// ── Series ───────────────────────────────────────────────────────────

export const createSeriesSchema = z.object({
  teacherId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  targetLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  goal: z.string().max(500).optional(),
})

export const updateSeriesSchema = createSeriesSchema
  .omit({ teacherId: true })
  .partial()
  .extend({
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    visibility: z.enum(['PUBLIC', 'LINK_ONLY', 'PRIVATE']).optional(),
  })

// ── Lecture ──────────────────────────────────────────────────────────

export const createLectureSchema = z.object({
  seriesId: z.string().min(1),
  title: z.string().min(1).max(200),
  learningObjective: z.string().min(1).max(1000),
  conceptTags: z.array(z.string()).min(1),
  content: z.string().max(50000).optional(),
  attachmentUrl: z.string().url().optional(),
})

export const updateLectureSchema = createLectureSchema
  .omit({ seriesId: true })
  .partial()

export const reorderLecturesSchema = z.object({
  seriesId: z.string().min(1),
  lectureIds: z.array(z.string().min(1)).min(1),
})

// ── Quiz ─────────────────────────────────────────────────────────────

export const quizChoiceSchema = z.object({
  label: z.string().min(1),
  isCorrect: z.boolean(),
})

export const createQuizSchema = z.object({
  lectureId: z.string().min(1),
  question: z.string().min(1).max(2000),
  choices: z.array(quizChoiceSchema).min(2).max(6),
  explanation: z.string().max(2000).optional(),
  conceptTag: z.string().optional(),
})

// ── CodingTest ───────────────────────────────────────────────────────

export const testCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
})

export const createCodingTestSchema = z.object({
  lectureId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  starterCode: z.string().max(10000).optional(),
  testCases: z.array(testCaseSchema).min(1),
  solutionCode: z.string().max(10000).optional(),
  gradingCriteria: z.string().max(2000).optional(),
  conceptTag: z.string().optional(),
})
