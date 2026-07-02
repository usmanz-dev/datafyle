'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, ArrowLeft } from 'lucide-react'

const NAV = [
  { href: '/admin',       label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users',    icon: Users },
  { href: '/admin/blog',  label: 'Blog',     icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[#1E293B] flex flex-col z-30">
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/10 shrink-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admin</p>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center">
            <span className="text-white text-[11px] font-bold">DF</span>
          </div>
          <span className="text-white font-bold text-[15px]">Datafyle</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to app */}
      <div className="px-4 py-4 border-t border-white/10 shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  )
}
