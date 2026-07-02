'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, Upload, Database, FileText, Users, Settings } from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/dashboard', icon: Upload, label: 'Upload Documents', exact: true, uploadAnchor: true },
  { href: '/dashboard/vendors', icon: Database, label: 'Vendors', badge: 'Pro', lockedFor: ['free', 'starter'] },
  { href: '/dashboard/reports', icon: FileText, label: 'Reports', badge: 'Starter', lockedFor: ['free'] },
  { href: '/dashboard/team', icon: Users, label: 'Team', badge: 'Starter', lockedFor: ['free'] },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  free:         { label: 'FREE',       cls: 'bg-slate-100 text-slate-600' },
  starter:      { label: 'STARTER',    cls: 'bg-blue-100 text-blue-700' },
  professional: { label: 'PRO',        cls: 'bg-indigo-100 text-indigo-700' },
  business:     { label: 'BUSINESS',   cls: 'bg-purple-100 text-purple-700' },
  enterprise:   { label: 'ENTERPRISE', cls: 'bg-amber-100 text-amber-700' },
}

interface Props {
  plan: string
  email: string
}

export function Sidebar({ plan, email }: Props) {
  const pathname = usePathname()
  const pb = PLAN_BADGE[plan] ?? PLAN_BADGE.free

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white border-r border-[#E2E8F0] z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[#E2E8F0] shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold tracking-tight">DF</span>
          </div>
          <span className="font-bold text-[#1E293B] text-[15px]">Datafyle</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, icon: Icon, label, badge, lockedFor, exact, uploadAnchor }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href)
            const locked = lockedFor?.includes(plan)

            const linkHref = uploadAnchor ? '/dashboard#upload' : href

            return (
              <Link
                key={label}
                href={linkHref}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive && !uploadAnchor
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'text-slate-600 hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {locked && badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide shrink-0">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-[#E2E8F0] flex items-center gap-3 shrink-0">
          <UserButton />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#1E293B] font-medium truncate">{email}</p>
            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 uppercase tracking-wide ${pb.cls}`}>
              {pb.label}
            </span>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-30 flex safe-area-inset-bottom">
        {NAV.filter((n) => !n.uploadAnchor).slice(0, 5).map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href + label}
              href={href}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-slate-400'
              }`}
            >
              <Icon size={20} />
              <span>{label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
