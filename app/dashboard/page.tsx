import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from './DashboardClient'
import { getDocsLimit } from '@/lib/plans'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  const firstName = clerkUser?.firstName ?? null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  // Admin users go straight to admin dashboard
  if (user.email === process.env.ADMIN_EMAIL) redirect('/admin')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Check if user is a team admin (owns a team)
  const team = await prisma.team.findFirst({
    where: { ownerId: user.id },
    include: {
      members: {
        where: { status: 'accepted', userId: { not: null } },
        select: { userId: true, inviteEmail: true, user: { select: { name: true, email: true } } },
      },
    },
  })

  // Collect all user IDs to fetch docs for
  const teamMemberIds = team
    ? team.members.map((m) => m.userId!).filter(Boolean)
    : []
  const allUserIds = [user.id, ...teamMemberIds.filter((id) => id !== user.id)]

  const [thisMonthCount, anomaliesCount, documents, googleToken] = await Promise.all([
    prisma.document.count({
      where: { userId: { in: allUserIds }, createdAt: { gte: startOfMonth } },
    }),
    prisma.document.count({
      where: {
        userId: { in: allUserIds },
        anomalyData: { path: ['isAnomaly'], equals: true },
      },
    }),
    prisma.document.findMany({
      where: { userId: { in: allUserIds } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.userToken.findUnique({
      where: { userId_provider: { userId: user.id, provider: 'google' } },
      select: { id: true },
    }),
  ])

  // Build team member list for filter dropdown
  const teamMembers = team
    ? team.members.map((m) => ({
        userId: m.userId!,
        name: m.user?.name ?? m.user?.email ?? m.inviteEmail,
      }))
    : []

  return (
    <DashboardClient
      firstName={firstName}
      user={{
        plan: user.plan,
        docsUsed: user.docsUsed,
        docsLimit: getDocsLimit(user.plan),
        totalDocsProcessed: user.totalDocsProcessed,
        id: user.id,
      }}
      initialStats={{
        thisMonthCount,
        anomaliesCount,
        fieldsExtracted: user.totalDocsProcessed * 7,
      }}
      initialDocuments={documents.map((d) => ({
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
      }))}
      isTeamAdmin={!!team}
      teamMembers={teamMembers}
      currentUserId={user.id}
      googleConnected={!!googleToken}
    />
  )
}
