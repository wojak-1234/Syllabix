
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'

async function main() {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const apiKey = envContent.match(/GEMINI_API_KEY=(.*)/)?.[1]?.trim()
  
  if (!apiKey) {
    console.log("No API Key found")
    return
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-3.1-flash-lite-preview"]
  
  for (const m of models) {
    try {
      console.log(`Testing ${m}...`)
      const model = genAI.getGenerativeModel({ model: m })
      const result = await model.generateContent("Hi")
      console.log(`Success with ${m}: ${result.response.text().substring(0, 10)}...`)
      return // Stop at first success
    } catch (e: any) {
      console.log(`Failed with ${m}: ${e.message.substring(0, 50)}`)
    }
  }
}

main()
