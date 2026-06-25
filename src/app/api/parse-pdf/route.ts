import { NextRequest, NextResponse } from 'next/server'
import { PdfReader } from 'pdfreader'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const text = await new Promise<string>((resolve, reject) => {
      const items: any[] = []
      
      new PdfReader({}).parseBuffer(buffer, (err: any, item: any) => {
        if (err) {
          reject(err)
        } else if (!item) {
          // EOF: Process items into lines
          const rows: Record<string, any[]> = {}
          for (const i of items) {
             // Round Y to 1 decimal place to group slightly misaligned text on the same line
             const y = Math.round(i.y * 10) / 10
             if (!rows[y]) rows[y] = []
             rows[y].push(i)
          }
          
          // Sort lines from top to bottom
          const sortedY = Object.keys(rows).map(Number).sort((a, b) => a - b)
          
          let extractedText = ''
          for (const y of sortedY) {
            // Sort text within the line from left to right
            const rowItems = rows[y].sort((a, b) => a.x - b.x)
            extractedText += rowItems.map(i => i.text).join(' ') + '\n'
          }
          
          resolve(extractedText.trim())
        } else if (item.text) {
          items.push(item)
        }
      })
    })

    return NextResponse.json({ text })
  } catch (err: any) {
    console.error('[parse-pdf]', err)
    return NextResponse.json(
      { error: err.message || 'Failed to parse PDF.' },
      { status: 500 }
    )
  }
}
