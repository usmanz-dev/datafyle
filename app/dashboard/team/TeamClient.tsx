'use client'

import { useState } from 'react'
import {
  Users, Mail, UserPlus, Crown, User,
  Trash2, Loader2, CheckCircle, XCircle, Clock, AlertCircle,
} from 'lucide-react'

interface Member {
  id: string
  userId: string | null
  inviteEmail: string
  role: string
  status: string
  joinedAt: string | null
  name: string | null
  email: string
}

interface Props {
  team: { id: string; name: string; ownerId: string }
  members: Member[]
  currentUserId: string
  seatLimit: number
  plan: string
}

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter', professional: 'Professional',
  business: 'Business', enterprise: 'Enterprise',
}

export function TeamClient({ team, members: initial, currentUserId, seatLimit, plan }: Props) {
  const [members, setMembers] = useState<Member[]>(initial)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'member'>('member')
  const [inviting, setInviting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const isOwner = members.some((m) => m.userId === currentUserId && m.role === 'admin')
  const activeCount = members.filter((m) => m.status !== 'removed').length
  const seatsFull = activeCount >= seatLimit
  const usagePct = seatLimit > 0 ? Math.round((activeCount / seatLimit) * 100) : 0

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setInviting(true)
    setStatus(null)
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({
          type: 'error',
          msg: data.error === 'seats_full'
            ? 'All seats are used. Buy extra seats (+$19/mo) to invite more members.'
            : (data.error ?? 'Failed to send invite'),
        })
        return
      }
      setStatus({ type: 'success', msg: `Invitation sent to ${email.trim()}` })
      setMembers((prev) => [
        ...prev,
        {
          id: data.memberId ?? crypto.randomUUID(),
          userId: null,
          inviteEmail: email.trim(),
          role,
          status: 'pending',
          joinedAt: null,
          name: null,
          email: email.trim(),
        },
      ])
      setEmail('')
    } finally {
      setInviting(false)
    }
  }

  async function handleRemove(memberId: string) {
    if (!confirm('Remove this member from the team?')) return
    setRemoving(memberId)
    try {
      const res = await fetch(`/api/team/members/${memberId}`, { method: 'DELETE' })
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId))
      } else {
        const data = await res.json()
        alert(data.error ?? 'Failed to remove member')
      }
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1E293B]">{team.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your team members and their access.</p>
        </div>

        {/* Seats progress */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[#1E293B]">
                {activeCount} / {seatLimit} seats used
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {PLAN_LABELS[plan] ?? plan} Plan
              </p>
            </div>
            {seatsFull && (
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buy Extra Seats (+$19/mo)
              </a>
            )}
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(usagePct, 100)}%`,
                backgroundColor: usagePct >= 100 ? '#EF4444' : '#2563EB',
              }}
            />
          </div>
        </div>

        {/* Invite form — admin only */}
        {isOwner && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5 mb-5">
            <h2 className="text-sm font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
              <UserPlus size={16} className="text-[#2563EB]" />
              Invite Member
            </h2>

            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
                disabled={inviting || seatsFull}
                className="flex-1 px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-11 disabled:opacity-50"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
                disabled={inviting || seatsFull}
                className="px-4 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-11 disabled:opacity-50"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                disabled={inviting || seatsFull || !email.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-11 whitespace-nowrap"
              >
                {inviting
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Mail size={14} />}
                Send Invite
              </button>
            </form>

            {seatsFull && (
              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <AlertCircle size={13} className="text-amber-500 shrink-0" />
                All seats are used.{' '}
                <a href="/pricing" className="text-[#2563EB] font-medium hover:underline">
                  Buy extra seats
                </a>{' '}
                to invite more members.
              </p>
            )}

            {status && (
              <div
                className={`mt-3 flex items-start gap-2 text-sm rounded-lg px-3 py-2.5 ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {status.type === 'success'
                  ? <CheckCircle size={15} className="shrink-0 mt-0.5" />
                  : <XCircle size={15} className="shrink-0 mt-0.5" />}
                <span>{status.msg}</span>
              </div>
            )}
          </div>
        )}

        {/* Members table */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
              <Users size={16} className="text-slate-400" />
              Team Members ({members.length})
            </h2>
          </div>

          {members.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-slate-400">No members yet. Send your first invite above.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {members.map((m) => {
                const isSelf = m.userId === currentUserId
                const displayName = m.name ?? m.email
                const initials = displayName.slice(0, 2).toUpperCase()

                return (
                  <div key={m.id} className="flex items-center gap-4 px-5 py-4">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#2563EB]">{initials}</span>
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E293B] truncate">
                        {displayName}
                        {isSelf && (
                          <span className="ml-1.5 text-xs font-normal text-slate-400">(you)</span>
                        )}
                      </p>
                      {m.name && (
                        <p className="text-xs text-slate-500 truncate">{m.email}</p>
                      )}
                    </div>

                    {/* Role badge */}
                    <RoleBadge role={m.role} />

                    {/* Status badge */}
                    <StatusBadge status={m.status} />

                    {/* Date joined */}
                    <p className="text-xs text-slate-400 hidden sm:block w-28 text-right shrink-0">
                      {m.joinedAt
                        ? new Date(m.joinedAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })
                        : 'Invited'}
                    </p>

                    {/* Remove button (admin only, not self) */}
                    {isOwner && !isSelf ? (
                      <button
                        onClick={() => handleRemove(m.id)}
                        disabled={removing === m.id}
                        title="Remove member"
                        className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-50"
                      >
                        {removing === m.id
                          ? <Loader2 size={15} className="animate-spin" />
                          : <Trash2 size={15} />}
                      </button>
                    ) : (
                      <div className="w-9 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 shrink-0">
        <Crown size={10} />
        Admin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
      <User size={10} />
      Member
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'accepted') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-600 shrink-0">
      <Clock size={11} />
      Pending
    </span>
  )
}
