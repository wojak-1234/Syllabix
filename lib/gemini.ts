import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables.")
}

export const genAI = new GoogleGenerativeAI(apiKey)

export const DEFAULT_MODEL = "gemini-3-flash-preview"

/**
 * 전역적으로 사용할 Gemini 모델 인스턴스를 반환합니다.
 * @param config 생성 결과 설정을 커스텀할 수 있습니다.
 * @param modelName 사용할 모델의 이름입니다.
 */
export function getGeminiModel(config?: Partial<GenerationConfig>, modelName: string = DEFAULT_MODEL) {
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
