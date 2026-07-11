import { inngest } from './client'
import { prisma } from '@/lib/prisma'
import { processDocument } from '@/lib/processDocument'
import { sendBatchStartedEmail } from '@/lib/emails'

// ── Monthly docs reset ────────────────────────────────────────────────────────
export const monthlyDocsResetFn = inngest.createFunction(
  {
    id: 'monthly-docs-reset',
    triggers: [{ cron: '0 0 1 * *' }],
  },
  async () => {
    await prisma.user.updateMany({ data: { docsUsed: 0 } })
    return { reset: true }
  }
)

// ── Process single document ───────────────────────────────────────────────────
export const processDocumentFn = inngest.createFunction(
  {
    id: 'process-single-document',
    retries: 3,
    throttle: { limit: 10, period: '1s' },
    triggers: [{ event: 'doc/process' }],
  },
  async ({ event }) => {
    const { documentId, userId } = event.data as { documentId: string; userId: string }
    return await processDocument(documentId, userId)
  }
)

// ── Process batch documents ───────────────────────────────────────────────────
export const processBatchFn = inngest.createFunction(
  {
    id: 'process-batch-documents',
    triggers: [{ event: 'doc/batch' }],
  },
  async ({ event, step }) => {
    const { documentIds, userId } = event.data as { documentIds: string[]; userId: string }

    // Fan out individual processing events
    for (const documentId of documentIds) {
      await step.sendEvent('trigger-' + documentId, {
        name: 'doc/process',
        data: { documentId, userId },
      })
    }

    // Send "batch started" email (fire-and-forget)
    const user = await prisma.user.findFirst({ where: { clerkId: userId } })
    if (user) {
      sendBatchStartedEmail(user.email, documentIds.length, user.name).catch((e) =>
        console.error('Failed to send batch started email:', e)
      )
    }

    return { queued: documentIds.length }
  }
)
