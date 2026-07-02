import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const vendorName = req.nextUrl.searchParams.get('name')
    if (!vendorName) return NextResponse.json({ error: 'Missing vendor name' }, { status: 400 })

    const docs = await prisma.document.findMany({
      where: { userId: user.id, status: 'done' },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, fileName: true, extractedData: true, anomalyData: true, createdAt: true },
    })

    const vendorDocs = docs.filter((d) => {
      const data = d.extractedData as { vendor?: { value?: string } } | null
      return data?.vendor?.value === vendorName
    }).slice(0, 20)

    const chartData = vendorDocs
      .map((d) => ({
        date: new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        amount: (d.extractedData as { totalAmount?: { value?: number } } | null)?.totalAmount?.value ?? 0,
      }))
      .reverse()

    const anomalies = vendorDocs.filter((d) => {
      const a = d.anomalyData as { isAnomaly?: boolean } | null
      return a?.isAnomaly
    })

    return NextResponse.json({ docs: vendorDocs, chartData, anomaliesCount: anomalies.length })
  } catch (error) {
    console.error('Vendors error:', error)
    return NextResponse.json({ error: 'Failed to fetch vendor data' }, { status: 500 })
  }
}
