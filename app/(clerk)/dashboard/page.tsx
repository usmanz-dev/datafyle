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

  let user = await prisma.user.findUnique({ where: { clerkId: userId } })

  if (!user) {
    // Clerk webhook may not have fired yet — create user now as fallback
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? ''
    const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || null
    user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email, name, plan: 'free', docsLimit: 10, docsUsed: 0 },
    })
  }

  // Admin users go straight to admin dashboard
  if (user.email === process.env.ADMIN_EMAIL) redirect('/admin')

  // Auto-accept any pending team invites for this user's email
  const pendingInvite = await prisma.teamMember.findFirst({
    where: { inviteEmail: user.email, status: 'pending' },
  })
  if (pendingInvite) {
    await prisma.teamMember.update({
      where: { id: pendingInvite.id },
      data: { userId: user.id, status: 'accepted', joinedAt: new Date() },
    })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Check if user owns a team OR is a member of a team
  const [ownedTeam, memberTeamRow] = await Promise.all([
    prisma.team.findFirst({
      where: { ownerId: user.id },
      include: {
        members: {
          where: { status: 'accepted', userId: { not: null } },
          select: { userId: true, inviteEmail: true, user: { select: { name: true, email: true } } },
        },
      },
    }),
    prisma.teamMember.findFirst({
      where: { userId: user.id, status: 'accepted' },
      include: {
        team: {
          include: {
            members: {
              where: { status: 'accepted', userId: { not: null } },
              select: { userId: true, inviteEmail: true, user: { select: { name: true, email: true } } },
            },
          },
        },
      },
    }),
  ])

  const team = ownedTeam ?? memberTeamRow?.team ?? null
  const isTeamAdmin = !!ownedTeam

  // Team owner's plan determines the shared pool limit
  const teamOwnerId = team?.ownerId ?? user.id
  const teamOwnerPlan = team && teamOwnerId !== user.id
    ? (await prisma.user.findUnique({ where: { id: teamOwnerId }, select: { plan: true } }))?.plan ?? user.plan
    : user.plan

  // Collect all user IDs in the team (for shared docs count)
  const teamMemberIds = team
    ? team.members.map((m) => m.userId!).filter(Boolean)
    : []
  const allUserIds = [user.id, ...teamMemberIds.filter((id) => id !== user.id)]

  const [thisMonthCount, anomaliesCount, documents] = await Promise.all([
    // All team docs this month = shared pool usage
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
        plan: teamOwnerPlan,
        docsUsed: thisMonthCount,
        docsLimit: getDocsLimit(teamOwnerPlan),
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
      isTeamAdmin={isTeamAdmin}
      teamMembers={teamMembers}
      currentUserId={user.id}
    />
  )
}
