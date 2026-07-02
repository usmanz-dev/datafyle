import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    if (user.plan === 'free') {
      return NextResponse.json({ error: 'Starter plan or higher required' }, { status: 403 })
    }

    const body = schema.safeParse(await req.json())
    if (!body.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const { month, year } = body.data

    const docs = await prisma.document.findMany({
      where: {
        userId: user.id,
        status: 'done',
        createdAt: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats
    let totalAmount = 0
    let totalConfidence = 0
    let anomaliesCount = 0
    const vendorMap: Record<string, number> = {}
    const typeMap: Record<string, number> = {}

    for (const doc of docs) {
      const data = doc.extractedData as {
        totalAmount?: { value?: number }
        vendor?: { value?: string }
        documentType?: string
      } | null
      const anomaly = doc.anomalyData as { isAnomaly?: boolean } | null

      totalAmount += data?.totalAmount?.value ?? 0
      totalConfidence += doc.confidenceScore ?? 0
      if (anomaly?.isAnomaly) anomaliesCount++

      const vendor = data?.vendor?.value
      if (vendor) vendorMap[vendor] = (vendorMap[vendor] ?? 0) + (data?.totalAmount?.value ?? 0)

      const docType = data?.documentType ?? 'other'
      typeMap[docType] = (typeMap[docType] ?? 0) + 1
    }

    const totalDocuments = docs.length
    const averageConfidence = totalDocuments > 0 ? Math.round(totalConfidence / totalDocuments) : 0
    const top5Vendors = Object.entries(vendorMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }))

    // Dynamic import to keep JSX in .tsx file
    const ReactPDF = await import('@react-pdf/renderer')
    const { MonthlyReportDocument } = await import('@/lib/pdf/MonthlyReport')
    const React = await import('react')

    const element = React.createElement(MonthlyReportDocument, {
      month,
      year,
      userEmail: user.email,
      totalDocuments,
      totalAmount,
      anomaliesCount,
      averageConfidence,
      top5Vendors,
      typeMap,
      docs: docs.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        confidenceScore: d.confidenceScore,
        extractedData: d.extractedData,
        anomalyData: d.anomalyData,
      })),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await (ReactPDF.renderToBuffer as (element: unknown) => Promise<Buffer>)(element)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="datafyle-${year}-${String(month).padStart(2, '0')}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
