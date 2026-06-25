import { NextRequest, NextResponse } from 'next/server'
import { ai, GEMINI_MODEL } from '@/lib/gemini'
import { buildPrompt } from '@/lib/prompts'
import { GenerateRequest } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()

    if (!body.jobDescription?.trim()) {
      return NextResponse.json(
        { error: 'Job description is required.' },
        { status: 400 }
      )
    }

    if (!body.resumeText?.trim()) {
      return NextResponse.json(
        { error: 'Resume text is required.' },
        { status: 400 }
      )
    }

    const prompt = buildPrompt(body)

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    })

    const raw = response.text?.trim()

    if (!raw) {
      return NextResponse.json(
        { error: 'Empty response from Gemini.' },
        { status: 502 }
      )
    }

    const parsed = JSON.parse(raw)

    if (!parsed.coldEmail || !parsed.coverLetter) {
      return NextResponse.json(
        { error: 'Invalid AI response format.' },
        { status: 502 }
      )
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[generate]', err)
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    )
  }
}
