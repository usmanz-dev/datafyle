import { prisma } from '@/lib/prisma'
import { getSignedDownloadUrl } from '@/lib/r2'
import { parseFile } from '@/lib/parsers'
import { extractWithClaude } from '@/lib/claude'
import { getVendorPattern, saveVendorPattern } from '@/lib/memory'
import { detectAnomaly } from '@/lib/anomaly'
import { sendAnomalyAlert } from '@/lib/emails/anomalyAlert'

function extractVendorHint(text: string): string {
  const lines = text.split('\n').filter((l) => l.trim().length > 2)
  return lines[0]?.trim().slice(0, 100) ?? ''
}

export async function processDocument(documentId: string, clerkUserId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId: clerkUserId } })
  if (!user) throw new Error('User not found')

  const document = await prisma.document.findUnique({ where: { id: documentId } })
  if (!document || document.userId !== user.id) throw new Error('Document not found')

  await prisma.document.update({
    where: { id: documentId },
    data: { status: 'processing' },
  })

  try {
    const keyStart = document.fileUrl.indexOf(clerkUserId + '/')
    const key = keyStart >= 0 ? document.fileUrl.slice(keyStart) : document.fileUrl
    const downloadUrl = await getSignedDownloadUrl(key)
    const fileRes = await fetch(downloadUrl)
    if (!fileRes.ok) throw new Error('Failed to download file from storage')
    const buffer = Buffer.from(await fileRes.arrayBuffer())

    const parsed = await parseFile(buffer, document.fileType)
    const text = parsed.text ?? ''

    const vendorHint = extractVendorHint(text)
    const vendorPattern = await getVendorPattern(user.id, vendorHint)

    const claudeResult = await extractWithClaude(
      text,
      document.fileType,
      vendorPattern ? vendorHint : undefined
    )

    const vendorName = (claudeResult.vendor?.value as string | null) ?? null
    const recentDocs = await prisma.document.findMany({
      where: { userId: user.id, status: 'done', id: { not: documentId } },
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

    const anomalyData = detectAnomaly(claudeResult, vendorPattern, vendorDocs)
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

    if (vendorName) {
      await saveVendorPattern(user.id, vendorName, totalAmount)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        docsUsed: { increment: 1 },
        totalDocsProcessed: { increment: 1 },
      },
    })

    if (anomalyData.severity === 'CRITICAL' || anomalyData.severity === 'HIGH') {
      await sendAnomalyAlert({
        to: user.email,
        fileName: document.fileName,
        vendor: vendorName,
        amount: totalAmount,
        severity: anomalyData.severity,
        anomalies: anomalyData.anomalies,
        recommendation: anomalyData.recommendation,
      })
    }

    return { success: true, documentId, extractedData: claudeResult, anomalyData }
  } catch (error) {
    await prisma.document
      .update({ where: { id: documentId }, data: { status: 'failed' } })
      .catch(() => null)
    throw error
  }
}
