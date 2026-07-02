import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  const firstName = clerkUser?.firstName ?? null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [thisMonthCount, anomaliesCount, documents] = await Promise.all([
    prisma.document.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.document.count({
      where: {
        userId: user.id,
        anomalyData: { path: ['isAnomaly'], equals: true },
      },
    }),
    prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
  ])

  return (
    <DashboardClient
      firstName={firstName}
      user={{
        plan: user.plan,
        docsUsed: user.docsUsed,
        docsLimit: user.docsLimit,
        totalDocsProcessed: user.totalDocsProcessed,
      }}
      initialStats={{
        thisMonthCount,
        anomaliesCount,
        fieldsExtracted: user.totalDocsProcessed * 7,
      }}
      initialDocuments={documents.map((d) => ({
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
      }))}
    />
  )
}
