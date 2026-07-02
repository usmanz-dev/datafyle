import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return NextResponse.json({
      documents: documents.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        fileType: d.fileType,
        fileSize: d.fileSize,
        status: d.status,
        extractedData: d.extractedData,
        anomalyData: d.anomalyData,
        confidenceScore: d.confidenceScore,
        uploadedByName: d.uploadedByName,
        createdAt: d.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Documents fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
