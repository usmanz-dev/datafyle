import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
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

    const { documentIds } = body.data

    // Verify all documents belong to this user
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const docCount = await prisma.document.count({
      where: { id: { in: documentIds }, userId: user.id },
    })
    if (docCount !== documentIds.length) {
      return NextResponse.json({ error: 'Invalid document IDs' }, { status: 403 })
    }

    // Queue via Inngest — returns immediately, processes in background
    await inngest.send({
      name: 'doc/batch',
      data: { documentIds, userId },
    })

    return NextResponse.json({ success: true, queued: documentIds.length })
  } catch (error) {
    console.error('Batch process error:', error)
    return NextResponse.json({ error: 'Failed to queue batch' }, { status: 500 })
  }
}
