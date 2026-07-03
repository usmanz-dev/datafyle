'use client'

import dynamic from 'next/dynamic'

const RevenueChartDynamic = dynamic(
  () => import('./RevenueChart').then((m) => ({ default: m.RevenueChart })),
  {
    ssr: false,
    loading: () => <div className="h-[220px] bg-slate-50 rounded animate-pulse" />,
  }
)

const PlanPieChartDynamic = dynamic(
  () => import('./PlanPieChart').then((m) => ({ default: m.PlanPieChart })),
  {
    ssr: false,
    loading: () => <div className="h-[220px] bg-slate-50 rounded animate-pulse" />,
  }
)

interface Props {
  revenueData: { month: string; revenue: number }[]
  planData: { plan: string; count: number }[]
}

export function AdminChartsClient({ revenueData, planData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5">
        <h2 className="text-sm font-semibold text-[#1E293B] mb-4">Monthly Recurring Revenue</h2>
        <RevenueChartDynamic data={revenueData} />
      </div>
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5">
        <h2 className="text-sm font-semibold text-[#1E293B] mb-4">Users by Plan</h2>
        <PlanPieChartDynamic data={planData} />
      </div>
    </div>
  )
}
