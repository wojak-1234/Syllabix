
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

async function main() {
  const modelName = "gemini-2.5-flash"
  console.log(`Testing model: ${modelName}`)
  
  try {
    const model = genAI.getGenerativeModel({ model: modelName })
    const result = await model.generateContent("Hello, are you there? Reply with YES.")
    console.log("Response:", result.response.text())
  } catch (e: any) {
    console.error("Error:", e.message)
    if (e.message.includes("not found")) {
        console.log("Suggestion: Model name might be incorrect.")
    }
  }
}

main()
