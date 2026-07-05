'use client'

import { useState } from 'react'
import { Search, Download, Users, CreditCard, XCircle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface UserRow {
  id: string
  email: string
  name: string | null
  plan: string
  docsUsed: number
  totalDocsProcessed: number
  createdAt: string
  paidAt: string | null
  cancelledAt: string | null
  previousPlan: string | null
  subscriptionStatus: string | null
}

interface Props {
  users: UserRow[]
}

const PLAN_BADGE: Record<string, string> = {
  free:         'bg-slate-100 text-slate-500',
  starter:      'bg-blue-100 text-blue-700',
  professional: 'bg-indigo-100 text-indigo-700',
  business:     'bg-purple-100 text-purple-700',
  enterprise:   'bg-amber-100 text-amber-700',
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name: string | null, email: string) {
  const src = name ?? email
  return src.slice(0, 2).toUpperCase()
}

function StatusChip({ plan, subscriptionStatus, cancelledAt }: {
  plan: string
  subscriptionStatus: string | null
  cancelledAt: string | null
}) {
  if (cancelledAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Cancelled
      </span>
    )
  }
  if (plan !== 'free' && subscriptionStatus === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Free
    </span>
  )
}

function UserTable({ rows, filter }: { rows: UserRow[]; filter: string }) {
  const [search, setSearch] = useState('')

  const filtered = rows.filter((u) =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  function exportCSV() {
    window.location.href = `/api/admin/export/users?filter=${filter}`
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10"
          />
        </div>
        <span className="text-xs text-slate-400 ml-auto tabular-nums">{filtered.length} users</span>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 text-[#1E293B] rounded-xl hover:bg-slate-50 transition-colors shadow-sm min-h-10"
        >
          <Download size={14} className="text-[#2563EB]" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500">Plan</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500">Docs Used</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500">Total Docs</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 hidden lg:table-cell">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 hidden lg:table-cell">Paid On</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">
                    {search ? 'No users match your search' : 'No users in this category'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(u.name, u.email)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#1E293B] truncate max-w-52" title={u.email}>
                            {u.email}
                          </p>
                          {u.name && (
                            <p className="text-xs text-slate-400 truncate">{u.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${PLAN_BADGE[u.plan] ?? 'bg-slate-100 text-slate-500'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-slate-600 font-medium">
                      {u.docsUsed.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-slate-400">
                      {u.totalDocsProcessed.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-xs hidden lg:table-cell">
                      {fmt(u.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs hidden lg:table-cell">
                      {u.paidAt ? (
                        <span className="text-slate-500">{fmt(u.paidAt)}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusChip
                        plan={u.plan}
                        subscriptionStatus={u.subscriptionStatus}
                        cancelledAt={u.cancelledAt}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function UsersClient({ users }: Props) {
  const paid      = users.filter((u) => u.plan !== 'free' && u.subscriptionStatus === 'active')
  const cancelled = users.filter((u) => u.cancelledAt !== null)
  const free      = users.filter((u) => u.plan === 'free')

  const tabs = [
    { value: 'all',       label: 'All Users',  count: users.length,     icon: Users,     rows: users,      filter: 'all'       },
    { value: 'paid',      label: 'Paid',        count: paid.length,      icon: CreditCard, rows: paid,      filter: 'paid'      },
    { value: 'cancelled', label: 'Cancelled',   count: cancelled.length, icon: XCircle,   rows: cancelled,  filter: 'cancelled' },
    { value: 'free',      label: 'Free',        count: free.length,      icon: Users,     rows: free,       filter: 'free'      },
  ]

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-5 bg-white border border-slate-100 shadow-sm rounded-xl p-1 h-auto gap-1">
        {tabs.map(({ value, label, count }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            {label}
            <span className="ml-2 tabular-nums text-[11px] opacity-70">{count}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, rows, filter }) => (
        <TabsContent key={value} value={value}>
          <UserTable rows={rows} filter={filter} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
