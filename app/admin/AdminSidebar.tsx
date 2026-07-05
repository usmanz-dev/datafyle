'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, BookOpen, Shield, ArrowLeft,
  ChevronRight,
} from 'lucide-react'

const NAV = [
  { href: '/admin',       label: 'Overview',   icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users',      icon: Users },
  { href: '/admin/blog',  label: 'Blog Posts', icon: BookOpen },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#0F172A] flex flex-col z-30 border-r border-white/5">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="relative">
          <Image
            src="/images/datafyle.png"
            alt="Datafyle"
            width={34}
            height={34}
            className="w-8 h-8 object-contain rounded-lg"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2563EB] rounded-full border-2 border-[#0F172A]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-[14px] leading-none">Datafyle</p>
          <p className="text-[10px] font-semibold text-[#3B82F6] uppercase tracking-widest mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2.5">Navigation</p>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 shrink-0 space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#2563EB]/10 rounded-xl border border-[#2563EB]/20">
          <Shield size={14} className="text-[#3B82F6] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#3B82F6] leading-none">Admin Access</p>
            <p className="text-[10px] text-[#3B82F6]/60 mt-0.5">Full permissions</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/5"
        >
          <ArrowLeft size={13} />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  )
}
