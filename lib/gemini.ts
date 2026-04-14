import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables.")
}

export const genAI = new GoogleGenerativeAI(apiKey)

/**
 * 용도별 모델 티어
 * - LITE    : 챗봇 대화, 단순 Q&A 등 가벼운 작업
 * - STANDARD: 온보딩 진단 문제 생성 등 중간 수준 작업
 * - PRO     : 커리큘럼 설계, 강의 초안 생성 등 복잡한 구조화 작업
 */
export const MODELS = {
  LITE:     "gemini-2.5-flash",
  STANDARD: "gemini-2.5-flash",
  PRO:      "gemini-2.5-flash",
} as const

/** @deprecated DEFAULT_MODEL 대신 MODELS.LITE / MODELS.STANDARD / MODELS.PRO 를 명시적으로 사용하세요. */
export const DEFAULT_MODEL = MODELS.LITE

/**
 * 전역적으로 사용할 Gemini 모델 인스턴스를 반환합니다.
 * @param config   - 생성 결과 설정 (temperature, maxOutputTokens 등)
 * @param modelName - 사용할 모델 (기본값: MODELS.LITE)
 */
export function getGeminiModel(
  config?: Partial<GenerationConfig>,
  modelName: string = MODELS.LITE
) {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      ...config
    }
  })
}
