import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { inngest } from '@/inngest/client'

const schema = z.object({
  documentIds: z.array(z.string().min(1)).min(1).max(500),
})

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

    await inngest.send({
      name: 'doc/batch',
      data: { documentIds: body.data.documentIds, userId },
    })

    return NextResponse.json({ success: true, total: body.data.documentIds.length })
  } catch (error) {
    console.error('Batch process error:', error)
    return NextResponse.json({ error: 'Failed to queue batch' }, { status: 500 })
  }
}
