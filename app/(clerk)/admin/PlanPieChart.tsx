'use client'

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface Props {
  data: { plan: string; count: number }[]
}

const PLAN_COLORS: Record<string, string> = {
  free:         '#94A3B8',
  starter:      '#2563EB',
  professional: '#4F46E5',
  business:     '#7C3AED',
  enterprise:   '#D97706',
}

const PLAN_LABELS: Record<string, string> = {
  free:         'Free',
  starter:      'Starter',
  professional: 'Professional',
  business:     'Business',
  enterprise:   'Enterprise',
}

export function PlanPieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-55 text-sm text-slate-400">
        No data yet
      </div>
    )
  }

  const labeled = data.map((d) => ({
    ...d,
    name: PLAN_LABELS[d.plan] ?? d.plan,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={labeled}
          cx="50%"
          cy="45%"
          innerRadius={48}
          outerRadius={82}
          dataKey="count"
          nameKey="name"
          paddingAngle={2}
        >
          {labeled.map((entry) => (
            <Cell
              key={entry.plan}
              fill={PLAN_COLORS[entry.plan] ?? '#94A3B8'}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any, name: any) => [Number(value).toLocaleString(), String(name)]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span style={{ fontSize: 12, color: '#475569' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
