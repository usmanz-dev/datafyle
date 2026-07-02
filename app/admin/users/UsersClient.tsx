'use client'

import { useState } from 'react'
import { Search, Download } from 'lucide-react'
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

function UserTable({ rows, filter }: { rows: UserRow[]; filter: string }) {
  const [search, setSearch] = useState('')

  const filtered = rows.filter((u) =>
    !search || u.email.toLowerCase().includes(search.toLowerCase())
  )

  function exportCSV() {
    window.location.href = `/api/admin/export/users?filter=${filter}`
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-9"
          />
        </div>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} users</span>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors shadow-sm min-h-9"
        >
          <Download size={14} className="text-[#2563EB]" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Email</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Name</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Plan</th>
                <th className="text-right px-4 py-3 font-medium text-[#1E293B]">Docs</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Signed Up</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Paid Date</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Cancelled</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">
                    {search ? 'No users match your search' : 'No users in this category'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 text-[#1E293B] font-medium max-w-48 truncate" title={u.email}>
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-32 truncate">
                      {u.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${PLAN_BADGE[u.plan] ?? 'bg-slate-100 text-slate-500'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                      {u.docsUsed.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{fmt(u.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{fmt(u.paidAt)}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {u.cancelledAt ? (
                        <span className="text-red-500">{fmt(u.cancelledAt)}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
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

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-5">
        <TabsTrigger value="all">All ({users.length})</TabsTrigger>
        <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
        <TabsTrigger value="free">Free ({free.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <UserTable rows={users} filter="all" />
      </TabsContent>
      <TabsContent value="paid">
        <UserTable rows={paid} filter="paid" />
      </TabsContent>
      <TabsContent value="cancelled">
        <UserTable rows={cancelled} filter="cancelled" />
      </TabsContent>
      <TabsContent value="free">
        <UserTable rows={free} filter="free" />
      </TabsContent>
    </Tabs>
  )
}

function StatusChip({
  plan,
  subscriptionStatus,
  cancelledAt,
}: {
  plan: string
  subscriptionStatus: string | null
  cancelledAt: string | null
}) {
  if (cancelledAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-600">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Cancelled
      </span>
    )
  }
  if (plan !== 'free' && subscriptionStatus === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-500">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Free
    </span>
  )
}
