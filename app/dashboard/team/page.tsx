import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { TeamClient } from './TeamClient'

const SEAT_LIMITS: Record<string, number> = {
  free: 1, starter: 2, professional: 5, business: 15, enterprise: 50,
}

export default async function TeamPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  // Free plan: teams not available
  if (user.plan === 'free') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-5">
            <Users size={24} className="text-[#2563EB]" />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">Team collaboration</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Invite your team members and collaborate on documents together. Available on Starter plan and above.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-11"
          >
            Upgrade to Starter — $49/mo
          </Link>
        </div>
      </div>
    )
  }

  // Find team owned by this user
  let team = await prisma.team.findFirst({
    where: { ownerId: user.id },
    include: {
      members: {
        orderBy: { joinedAt: 'asc' },
        include: { user: { select: { name: true, email: true } } },
      },
    },
  })

  // Auto-create team on first visit
  if (!team) {
    const clerkUser = await currentUser()
    const firstName = clerkUser?.firstName ?? user.name ?? user.email.split('@')[0]
    const teamName = `${firstName}'s Team`

    team = await prisma.team.create({
      data: {
        name: teamName,
        ownerId: user.id,
        plan: user.plan,
        members: {
          create: {
            userId: user.id,
            inviteEmail: user.email,
            role: 'admin',
            status: 'accepted',
            joinedAt: new Date(),
          },
        },
      },
      include: {
        members: {
          orderBy: { joinedAt: 'asc' },
          include: { user: { select: { name: true, email: true } } },
        },
      },
    })
  }

  const seatLimit = SEAT_LIMITS[user.plan] ?? 2

  return (
    <TeamClient
      team={{ id: team.id, name: team.name, ownerId: team.ownerId }}
      members={team.members.map((m) => ({
        id: m.id,
        userId: m.userId,
        inviteEmail: m.inviteEmail,
        role: m.role,
        status: m.status,
        joinedAt: m.joinedAt?.toISOString() ?? null,
        name: m.user?.name ?? null,
        email: m.user?.email ?? m.inviteEmail,
      }))}
      currentUserId={user.id}
      seatLimit={seatLimit}
      plan={user.plan}
    />
  )
}
