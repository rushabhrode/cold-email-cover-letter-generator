import { GoogleGenAI } from '@google/genai'

if (!process.env.GEMINI_API_KEY) {
  // Using a fallback behavior for client-side building or runtime if not set
  // This will throw when attempting to use the client.
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY',
})

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
