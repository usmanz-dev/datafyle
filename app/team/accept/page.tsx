import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface Props {
  searchParams: Promise<{ memberId?: string }>
}

export default async function AcceptInvitePage({ searchParams }: Props) {
  const { memberId } = await searchParams

  if (!memberId) {
    return <ErrorPage message="Invalid or missing invite link." />
  }

  const member = await prisma.teamMember.findUnique({
    where: { id: memberId },
    include: { team: { include: { members: { where: { role: 'admin', status: 'accepted' }, take: 1, include: { user: true } } } } },
  })

  if (!member) {
    return <ErrorPage message="This invite link is invalid or has already been used." />
  }

  if (member.status === 'accepted') {
    return <ErrorPage message="This invitation has already been accepted." />
  }

  const teamName = member.team.name
  const inviterName = member.team.members[0]?.user?.name ?? member.team.members[0]?.user?.email ?? 'Your team admin'

  // Check if user is signed in
  const { userId } = await auth()

  if (userId) {
    // Find user in DB
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })

    if (user) {
      // Accept the invite
      await prisma.teamMember.update({
        where: { id: memberId },
        data: {
          userId: user.id,
          status: 'accepted',
          joinedAt: new Date(),
        },
      })
      redirect('/dashboard?welcome=team')
    }
  }

  // Not signed in — show sign in / sign up buttons
  const encodedRedirect = encodeURIComponent(`/team/accept?memberId=${memberId}`)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center">
            <span className="text-white text-xs font-bold">DF</span>
          </div>
          <span className="font-bold text-[#1E293B] text-lg">Datafyle</span>
        </div>

        {/* Invite details */}
        <div className="bg-[#EFF6FF] rounded-lg px-5 py-4 mb-6 text-left">
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-[#1E293B]">{inviterName}</strong> has invited you to join{' '}
            <strong className="text-[#1E293B]">{teamName}</strong> on Datafyle.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Invited as:{' '}
            <span className="font-medium capitalize text-[#1E293B]">{member.role}</span>
            {' · '}
            <span className="font-medium text-[#1E293B]">{member.inviteEmail}</span>
          </p>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Sign in or create a free account to accept this invitation.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={`/sign-up?redirect_url=${encodedRedirect}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-11"
          >
            Create account &amp; accept
          </Link>
          <Link
            href={`/sign-in?redirect_url=${encodedRedirect}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-[#E2E8F0] text-[#1E293B] text-sm font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors min-h-11"
          >
            Sign in to accept
          </Link>
        </div>
      </div>
    </div>
  )
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[#1E293B] mb-2">Invalid invite</h2>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}
