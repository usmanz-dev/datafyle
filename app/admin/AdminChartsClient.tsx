'use client'

import dynamic from 'next/dynamic'

const RevenueChartDynamic = dynamic(
  () => import('./RevenueChart').then((m) => ({ default: m.RevenueChart })),
  {
    ssr: false,
    loading: () => <div className="h-60 bg-slate-50 rounded-xl animate-pulse" />,
  }
)

const PlanPieChartDynamic = dynamic(
  () => import('./PlanPieChart').then((m) => ({ default: m.PlanPieChart })),
  {
    ssr: false,
    loading: () => <div className="h-60 bg-slate-50 rounded-xl animate-pulse" />,
  }
)

interface Props {
  revenueData: { month: string; revenue: number }[]
  planData: { plan: string; count: number }[]
}

export function AdminChartsClient({ revenueData, planData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Revenue — takes 8/12 cols */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-[#1E293B]">Monthly Recurring Revenue</h2>
            <p className="text-xs text-slate-400 mt-0.5">Last 6 months trend</p>
          </div>
        </div>
        <RevenueChartDynamic data={revenueData} />
      </div>

      {/* Plan distribution — takes 4/12 cols */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-[#1E293B]">Users by Plan</h2>
          <p className="text-xs text-slate-400 mt-0.5">Distribution breakdown</p>
        </div>
        <PlanPieChartDynamic data={planData} />
      </div>
    </div>
  )
}
