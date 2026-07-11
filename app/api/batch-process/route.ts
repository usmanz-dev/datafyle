import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { processDocument } from '@/lib/processDocument'
import { sendBatchStartedEmail } from '@/lib/emails'
import { prisma } from '@/lib/prisma'

export const maxDuration = 300 // 5 min — allows large batches on Vercel Pro

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

    const { documentIds } = body.data

    // Send batch started email (non-blocking)
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (user) {
      sendBatchStartedEmail(user.email, documentIds.length, user.name).catch((e) =>
        console.error('Failed to send batch email:', e)
      )
    }

    // Process each document sequentially (same as single upload)
    const results = { success: 0, failed: 0 }
    for (const documentId of documentIds) {
      try {
        await processDocument(documentId, userId)
        results.success++
      } catch (e) {
        console.error(`Failed to process document ${documentId}:`, e)
        results.failed++
      }
    }

    return NextResponse.json({
      success: true,
      total: documentIds.length,
      processed: results.success,
      failed: results.failed,
    })
  } catch (error) {
    console.error('Batch process error:', error)
    return NextResponse.json({ error: 'Failed to process batch' }, { status: 500 })
  }
}
