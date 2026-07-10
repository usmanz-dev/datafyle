'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, BookOpen, Shield, ArrowLeft,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react'

const NAV = [
  { href: '/admin',       label: 'Overview',   icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users',      icon: Users },
  { href: '/admin/blog',  label: 'Blog Posts', icon: BookOpen },
]

const SIDEBAR_BG = {
  background: `
    radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px),
    radial-gradient(ellipse 120% 40% at 50% 60%, rgba(37,99,235,0.45) 0%, transparent 70%),
    linear-gradient(180deg, #0F172A 0%, #0f1f45 50%, #0F172A 100%)
  `,
  backgroundSize: '20px 20px, 100% 100%, 100% 100%',
}

interface Props {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  adminEmail: string
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose, adminEmail }: Props) {
  const pathname = usePathname()

  function NavItems({ onItemClick }: { onItemClick?: () => void }) {
    return (
      <>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onItemClick}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-xl transition-all duration-150 group relative ${
                collapsed ? 'py-3 justify-center' : 'px-3 py-2.5'
              } ${active
                ? 'bg-white text-[#2563EB] shadow-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="flex-1 text-sm font-medium whitespace-nowrap">{label}</span>
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1E293B] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </>
    )
  }

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-60'}`}
        style={SIDEBAR_BG}
      >
        {/* Logo */}
        <div className="flex items-center h-16 shrink-0 relative border-b border-white/10">
          {collapsed ? (
            <div className="w-full flex items-center justify-center">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Image src="/images/datafyle.png" alt="Datafyle" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
            </div>
          ) : (
            <div className="flex items-center px-4 gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-white text-[16px] tracking-tight whitespace-nowrap block">
                  Data<span className="text-blue-200">fyle</span>
                </span>
                <span className="text-[10px] font-semibold text-[#3B82F6] uppercase tracking-widest">Admin Panel</span>
              </div>
            </div>
          )}

          {/* Collapse toggle button */}
          <button
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border-2 border-slate-300 shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10"
          >
            {collapsed
              ? <ChevronRight size={13} className="text-[#2563EB]" />
              : <ChevronLeft  size={13} className="text-[#2563EB]" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2.5">Navigation</p>
          )}
          <NavItems />
        </nav>

        {/* Footer */}
        <div className={`border-t border-white/10 shrink-0 space-y-2 ${collapsed ? 'px-2 py-3' : 'px-4 py-4'}`}>
          {!collapsed && (
            <>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#2563EB]/10 rounded-xl border border-[#2563EB]/20 mb-1">
                <Shield size={14} className="text-[#3B82F6] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#3B82F6] leading-none truncate">{adminEmail}</p>
                  <p className="text-[10px] text-[#3B82F6]/60 mt-0.5">Full permissions</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
              >
                <ArrowLeft size={13} />
                Back to Dashboard
              </Link>
            </>
          )}
          {collapsed && (
            <div className="flex justify-center" title={adminEmail}>
              <div className="w-9 h-9 rounded-xl bg-[#2563EB]/20 flex items-center justify-center">
                <Shield size={15} className="text-[#3B82F6]" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile sidebar ──────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
      />

      {/* Slide-out panel */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={SIDEBAR_BG}
      >
        {/* Header */}
        <div className="flex items-center h-14 shrink-0 border-b border-white/10 px-4">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Image src="/images/datafyle.png" alt="" width={18} height={18} className="w-4 h-4 object-contain brightness-0 invert" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-[15px] tracking-tight whitespace-nowrap block">
                Data<span className="text-blue-200">fyle</span>
              </span>
              <span className="text-[9px] font-semibold text-[#3B82F6] uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2.5">Navigation</p>
          <NavItems onItemClick={onMobileClose} />
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-4 shrink-0 space-y-2">
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#2563EB]/10 rounded-xl border border-[#2563EB]/20">
            <Shield size={14} className="text-[#3B82F6] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#3B82F6] leading-none truncate">{adminEmail}</p>
              <p className="text-[10px] text-[#3B82F6]/60 mt-0.5">Full permissions</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={13} />
            Back to Dashboard
          </Link>
        </div>
      </aside>
    </>
  )
}
