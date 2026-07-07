import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { processDocument } from '@/lib/processDocument'

export const maxDuration = 60

const schema = z.object({ documentId: z.string().min(1) })

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = schema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const result = await processDocument(body.data.documentId, userId)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Processing error:', message)
    return NextResponse.json({ error: 'Processing failed', detail: message }, { status: 500 })
  }
}
