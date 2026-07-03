import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { processDocumentFn, processBatchFn, monthlyDocsResetFn } from '@/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processDocumentFn, processBatchFn, monthlyDocsResetFn],
})
