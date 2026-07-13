import { prisma } from '@/lib/prisma'
import {
  DollarSign, Users, FileText, CreditCard, XCircle,
  AlertTriangle, TrendingUp, UserPlus, Activity, ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { AdminChartsClient } from './AdminChartsClient'

const PLAN_PRICES: Record<string, number> = {
  starter: 49, professional: 149, business: 349, enterprise: 599,
}

const PLAN_BADGE: Record<string, string> = {
  free:         'bg-slate-100 text-slate-500',
  starter:      'bg-blue-100 text-blue-700',
  professional: 'bg-indigo-100 text-indigo-700',
  business:     'bg-purple-100 text-purple-700',
  enterprise:   'bg-amber-100 text-amber-700',
}

export default async function AdminPage() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)

  const [
    totalUsers,
    newUsersThisMonth,
    newUsersThisWeek,
    docsToday,
    docsThisWeek,
    totalDocsEver,
    activeSubs,
    cancellationsThisMonth,
    totalAnomalies,
    planGroups,
    paidUsers,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.document.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.document.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.document.count(),
    prisma.subscription.findMany({ where: { status: 'active' }, select: { plan: true } }),
    prisma.user.count({ where: { cancelledAt: { gte: startOfMonth } } }),
    prisma.document.count({ where: { anomalyData: { path: ['isAnomaly'], equals: true } } }),
    prisma.user.groupBy({ by: ['plan'], _count: { plan: true } }),
    prisma.user.findMany({
      where: { paidAt: { not: null } },
      select: { plan: true, paidAt: true, cancelledAt: true, previousPlan: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, email: true, name: true, plan: true, createdAt: true, paidAt: true },
    }),
  ])

  const mrr = activeSubs.reduce((sum, s) => sum + (PLAN_PRICES[s.plan] ?? 0), 0)
  const arr = mrr * 12
  const paidCount = activeSubs.length

  // Revenue chart: last 6 months
  const revenueChartData = Array.from({ length: 6 }, (_, i) => {
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0)
    const label = new Date(now.getFullYear(), now.getMonth() - (5 - i)).toLocaleDateString('en-US', { month: 'short' })
    const monthMRR = paidUsers.reduce((sum, u) => {
      if (!u.paidAt || u.paidAt > monthEnd) return sum
      if (u.cancelledAt && u.cancelledAt <= monthEnd) return sum
      const plan = u.cancelledAt ? (u.previousPlan ?? u.plan) : u.plan
      return sum + (PLAN_PRICES[plan] ?? 0)
    }, 0)
    return { month: label, revenue: monthMRR }
  })

  const planPieData = planGroups
    .map((g) => ({ plan: g.plan, count: g._count.plan }))
    .sort((a, b) => b.count - a.count)

  // 8 KPI cards in 2 rows
  const kpiRow1 = [
    {
      label: 'MRR',
      value: `$${mrr.toLocaleString()}`,
      sub: `ARR: $${arr.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-[#2563EB]',
      bg: 'bg-[#EFF6FF]',
    },
    {
      label: 'Active Subscriptions',
      value: paidCount.toLocaleString(),
      sub: 'Paying customers',
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      sub: `+${newUsersThisMonth} this month`,
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'New This Week',
      value: newUsersThisWeek.toLocaleString(),
      sub: `${newUsersThisMonth} this month`,
      icon: UserPlus,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ]

  const kpiRow2 = [
    {
      label: 'Docs Today',
      value: docsToday.toLocaleString(),
      sub: `${docsThisWeek} this week`,
      icon: FileText,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      label: 'Total Processed',
      value: totalDocsEver.toLocaleString(),
      sub: 'All time documents',
      icon: Activity,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      label: 'Cancellations',
      value: cancellationsThisMonth.toLocaleString(),
      sub: 'This month',
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'Anomalies',
      value: totalAnomalies.toLocaleString(),
      sub: 'Total detected',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="p-6 max-w-7xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time platform metrics and health</p>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {kpiRow1.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <TrendingUp size={13} className="text-slate-200" />
            </div>
            <p className="text-2xl font-bold text-[#1E293B] tabular-nums">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiRow2.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1E293B] tabular-nums">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AdminChartsClient revenueData={revenueChartData} planData={planPieData} />

      {/* Recent Signups */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-[#1E293B]">Recent Signups</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest 8 accounts created</p>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
          >
            View all
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentSignups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-400">
                    No signups yet
                  </td>
                </tr>
              ) : (
                recentSignups.map((u) => {
                  const initials = (u.name ?? u.email).slice(0, 2).toUpperCase()
                  const joinedStr = u.createdAt.toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#1E293B] truncate max-w-56">{u.email}</p>
                            {u.name && <p className="text-xs text-slate-400 truncate">{u.name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${PLAN_BADGE[u.plan] ?? 'bg-slate-100 text-slate-500'}`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                        {joinedStr}
                      </td>
                      <td className="px-5 py-3.5">
                        {u.paidAt ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Free
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
