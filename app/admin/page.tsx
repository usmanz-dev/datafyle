import { prisma } from '@/lib/prisma'
import { DollarSign, Users, FileText, CreditCard, XCircle, AlertTriangle } from 'lucide-react'
import { AdminChartsClient } from './AdminChartsClient'

const PLAN_PRICES: Record<string, number> = {
  starter: 49, professional: 149, business: 349, enterprise: 599,
}

export default async function AdminPage() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalUsers,
    docsToday,
    activeSubs,
    cancellationsThisMonth,
    totalAnomalies,
    planGroups,
    paidUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.document.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.subscription.findMany({
      where: { status: 'active' },
      select: { plan: true },
    }),
    prisma.user.count({ where: { cancelledAt: { gte: startOfMonth } } }),
    prisma.document.count({
      where: { anomalyData: { path: ['isAnomaly'], equals: true } },
    }),
    prisma.user.groupBy({
      by: ['plan'],
      _count: { plan: true },
    }),
    prisma.user.findMany({
      where: { paidAt: { not: null } },
      select: { plan: true, paidAt: true, cancelledAt: true, previousPlan: true },
    }),
  ])

  // MRR from active subscriptions
  const mrr = activeSubs.reduce((sum, s) => sum + (PLAN_PRICES[s.plan] ?? 0), 0)

  // Revenue chart: MRR for each of the last 6 months
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

  // Plan breakdown for pie chart
  const planPieData = planGroups
    .map((g) => ({ plan: g.plan, count: g._count.plan }))
    .sort((a, b) => b.count - a.count)

  const stats = [
    {
      label: 'MRR',
      value: `$${mrr.toLocaleString()}`,
      sub: `${activeSubs.length} active plans`,
      icon: DollarSign,
      color: 'text-[#2563EB]',
      bg: 'bg-[#EFF6FF]',
      border: 'border-l-[#2563EB]',
    },
    {
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      sub: 'All time signups',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-l-indigo-500',
    },
    {
      label: 'Docs Today',
      value: docsToday.toLocaleString(),
      sub: 'Processed since midnight',
      icon: FileText,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-l-emerald-500',
    },
    {
      label: 'Active Subscriptions',
      value: activeSubs.length.toLocaleString(),
      sub: `$${mrr.toLocaleString()} MRR`,
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-l-purple-500',
    },
    {
      label: 'Cancellations',
      value: cancellationsThisMonth.toLocaleString(),
      sub: 'This month',
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-l-red-500',
    },
    {
      label: 'Anomalies',
      value: totalAnomalies.toLocaleString(),
      sub: 'Total detected',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-l-amber-500',
    },
  ]

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">Admin Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time platform metrics</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={`bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-4 border-l-4 ${border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <AdminChartsClient revenueData={revenueChartData} planData={planPieData} />
    </div>
  )
}
