import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyBxBhH8nPk2Hra3OSHjcyHqbvbHMv_8f1A')

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
}

async function runChat(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  })

  const result = await chatSession.sendMessage(prompt)
  return result.response.text()
}
export default runChat
