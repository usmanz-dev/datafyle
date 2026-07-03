import { inngest } from './client'
import { prisma } from '@/lib/prisma'
import { processDocument } from '@/lib/processDocument'
import { Resend } from 'resend'

// ─── Monthly docs reset ───────────────────────────────────────────────────────
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

const resend = new Resend(process.env.RESEND_API_KEY)

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

export const processBatchFn = inngest.createFunction(
  {
    id: 'process-batch-documents',
    triggers: [{ event: 'doc/batch' }],
  },
  async ({ event, step }) => {
    const { documentIds, userId } = event.data as { documentIds: string[]; userId: string }

    for (const documentId of documentIds) {
      await step.sendEvent('trigger-' + documentId, {
        name: 'doc/process',
        data: { documentId, userId },
      })
    }

    const user = await prisma.user.findFirst({ where: { clerkId: userId } })
    if (user) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
        to: user.email,
        subject: `Batch queued — ${documentIds.length} document${documentIds.length !== 1 ? 's' : ''}`,
        text: [
          `Your batch of ${documentIds.length} document${documentIds.length !== 1 ? 's' : ''} has been queued for processing.`,
          ``,
          `Each document will be processed individually. You will receive an alert for any anomalies detected.`,
          ``,
          `View results: https://datafyle.com/dashboard`,
        ].join('\n'),
      })
    }

    return { queued: documentIds.length }
  }
)
