import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSignedDownloadUrl } from '@/lib/r2'
import { parseFile } from '@/lib/parsers'
import { extractWithClaude } from '@/lib/claude'
import { getVendorPattern, saveVendorPattern } from '@/lib/memory'
import { detectAnomaly } from '@/lib/anomaly'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({ documentId: z.string().min(1) })

function extractVendorHint(text: string): string {
  const lines = text.split('\n').filter((l) => l.trim().length > 2)
  return lines[0]?.trim().slice(0, 100) ?? ''
}

export async function POST(req: NextRequest) {
  let documentId: string | undefined

  try {
    // Step 1: Auth
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Validate input
    const body = schema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    documentId = body.data.documentId

    // Step 2: Get document and verify ownership
    const document = await prisma.document.findUnique({ where: { id: documentId } })
    if (!document || document.userId !== user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Step 3: Set status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'processing' },
    })

    // Step 4: Download file from R2 via signed URL
    const keyStart = document.fileUrl.indexOf(userId + '/')
    const key = keyStart >= 0 ? document.fileUrl.slice(keyStart) : document.fileUrl
    const downloadUrl = await getSignedDownloadUrl(key)
    const fileRes = await fetch(downloadUrl)
    if (!fileRes.ok) throw new Error('Failed to download file from storage')
    const buffer = Buffer.from(await fileRes.arrayBuffer())

    // Step 5: Parse file to extract text
    const parsed = await parseFile(buffer, document.fileType)
    const text = parsed.text ?? ''

    // Step 6: Extract rough vendor hint from text
    const vendorHint = extractVendorHint(text)

    // Step 7: Get vendor pattern for AI hint
    const vendorPattern = await getVendorPattern(user.id, vendorHint)

    // Step 8: Claude AI extraction
    const claudeResult = await extractWithClaude(
      text,
      document.fileType,
      vendorPattern ? vendorHint : undefined
    )

    // Step 9: Get recent docs with same vendor for anomaly check
    const vendorName = (claudeResult.vendor?.value as string | null) ?? null
    const recentDocs = await prisma.document.findMany({
      where: {
        userId: user.id,
        status: 'done',
        id: { not: documentId },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { extractedData: true },
    })

    const vendorDocs = vendorName
      ? recentDocs.filter((d) => {
          const data = d.extractedData as { vendor?: { value?: string } } | null
          return data?.vendor?.value === vendorName
        })
      : recentDocs

    // Step 10: Detect anomalies
    const anomalyData = detectAnomaly(claudeResult, vendorPattern, vendorDocs)

    // Step 11: Save results to document
    const totalAmount = (claudeResult.totalAmount?.value as number | null) ?? null
    await prisma.document.update({
      where: { id: documentId },
      data: {
        extractedData: JSON.parse(JSON.stringify(claudeResult)),
        anomalyData: JSON.parse(JSON.stringify(anomalyData)),
        confidenceScore: claudeResult.overallConfidence ?? null,
        status: 'done',
      },
    })

    // Step 12: Save vendor pattern
    if (vendorName) {
      await saveVendorPattern(user.id, vendorName, totalAmount)
    }

    // Step 13: Increment usage counters
    await prisma.user.update({
      where: { id: user.id },
      data: {
        docsUsed: { increment: 1 },
        totalDocsProcessed: { increment: 1 },
      },
    })

    // Step 14: Send anomaly email for CRITICAL or HIGH
    if (anomalyData.severity === 'CRITICAL' || anomalyData.severity === 'HIGH') {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
        to: user.email,
        subject: `Anomaly detected in ${document.fileName}`,
        text: [
          `An anomaly was detected in your document "${document.fileName}".`,
          `Severity: ${anomalyData.severity}`,
          `Reason: ${anomalyData.anomalies[0]?.reason ?? 'Unknown'}`,
          `Recommendation: ${anomalyData.recommendation}`,
          ``,
          `Log in to review: https://datafyle.com/dashboard`,
        ].join('\n'),
      })
    }

    // Step 15: Return results
    return NextResponse.json({
      success: true,
      documentId,
      extractedData: claudeResult,
      anomalyData,
    })
  } catch (error) {
    console.error('Processing error:', error)

    // Set document status to failed
    if (documentId) {
      await prisma.document.update({
        where: { id: documentId },
        data: { status: 'failed' },
      }).catch(() => null)
    }

    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
