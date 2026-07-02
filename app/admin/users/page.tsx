import { prisma } from '@/lib/prisma'
import { UsersClient } from './UsersClient'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      docsUsed: true,
      totalDocsProcessed: true,
      createdAt: true,
      paidAt: true,
      cancelledAt: true,
      previousPlan: true,
      subscription: { select: { status: true } },
    },
  })

  const rows = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    plan: u.plan,
    docsUsed: u.docsUsed,
    totalDocsProcessed: u.totalDocsProcessed,
    createdAt: u.createdAt.toISOString(),
    paidAt: u.paidAt?.toISOString() ?? null,
    cancelledAt: u.cancelledAt?.toISOString() ?? null,
    previousPlan: u.previousPlan,
    subscriptionStatus: u.subscription?.status ?? null,
  }))

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">{rows.length} total accounts</p>
      </div>
      <UsersClient users={rows} />
    </div>
  )
}
