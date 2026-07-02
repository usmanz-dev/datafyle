import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    // If user is a team admin, include all accepted team member documents
    const team = await prisma.team.findFirst({
      where: { ownerId: user.id },
      select: {
        members: {
          where: { status: 'accepted', userId: { not: null } },
          select: { userId: true },
        },
      },
    })

    const memberIds = team
      ? team.members.map((m) => m.userId!).filter(Boolean)
      : []
    const allUserIds = [user.id, ...memberIds.filter((id) => id !== user.id)]

    const documents = await prisma.document.findMany({
      where: { userId: { in: allUserIds } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return NextResponse.json({
      documents: documents.map((d) => ({
        id: d.id,
        userId: d.userId,
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
