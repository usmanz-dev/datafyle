'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Upload, Database, FileText,
  Users, Settings, ChevronLeft, ChevronRight, Lock, X,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard',         icon: LayoutDashboard, label: 'Dashboard',       exact: true,  uploadAnchor: false },
  { href: '/dashboard#upload',  icon: Upload,          label: 'Upload Documents', exact: false, uploadAnchor: true  },
  { href: '/dashboard/vendors', icon: Database,        label: 'Vendors',          exact: false, badge: 'PRO',     lockedFor: ['free', 'starter'] },
  { href: '/dashboard/reports', icon: FileText,        label: 'Reports',          exact: false, badge: 'STARTER', lockedFor: ['free'] },
  { href: '/dashboard/team',    icon: Users,           label: 'Team',             exact: false, badge: 'STARTER', lockedFor: ['free'] },
  { href: '/settings',          icon: Settings,        label: 'Settings',         exact: false },
]

const PLAN_COLORS = {
  free:         'bg-white/10 text-white/70',
  starter:      'bg-white/20 text-white',
  professional: 'bg-amber-400/30 text-amber-200',
  business:     'bg-purple-400/30 text-purple-200',
  enterprise:   'bg-emerald-400/30 text-emerald-200',
}
const PLAN_LABELS = {
  free: 'FREE', starter: 'STARTER', professional: 'PRO',
  business: 'BUSINESS', enterprise: 'ENTERPRISE',
}

const SIDEBAR_BG = {
  background: `
    radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px),
    radial-gradient(ellipse 120% 40% at 50% 60%, rgba(37,99,235,0.45) 0%, transparent 70%),
    linear-gradient(180deg, #0F172A 0%, #0f1f45 50%, #0F172A 100%)
  `,
  backgroundSize: '20px 20px, 100% 100%, 100% 100%',
}

interface Props {
  plan: string
  email: string
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ plan, email, collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname()
  const planCls   = PLAN_COLORS[plan as keyof typeof PLAN_COLORS]   ?? PLAN_COLORS.free
  const planLabel = PLAN_LABELS[plan as keyof typeof PLAN_LABELS]   ?? 'FREE'

  function NavItems({ onItemClick }: { onItemClick?: () => void }) {
    return (
      <>
        {NAV.map(({ href, icon: Icon, label, badge, lockedFor, exact, uploadAnchor }) => {
          const isActive = uploadAnchor ? false : exact ? pathname === href : pathname.startsWith(href)
          const locked = lockedFor?.includes(plan)
          return (
            <Link
              key={label}
              href={href}
              onClick={onItemClick}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-xl transition-all duration-150 group relative ${
                collapsed ? 'py-3 justify-center' : 'px-3 py-2.5'
              } ${isActive
                ? 'bg-white text-[#2563EB] shadow-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-medium whitespace-nowrap">{label}</span>
                  {locked && badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/15 text-white/70 uppercase tracking-wide shrink-0 flex items-center gap-1">
                      <Lock size={8} />{badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1E293B] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                  {label}{locked && badge ? ` (${badge})` : ''}
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
              <span className="font-bold text-white text-[16px] tracking-tight whitespace-nowrap">
                Data<span className="text-blue-200">fyle</span>
              </span>
            </div>
          )}
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
          <NavItems />
        </nav>

        {/* User footer */}
        <div className={`border-t border-white/10 shrink-0 ${collapsed ? 'px-2 py-3' : 'px-4 py-4'}`}>
          {collapsed ? (
            <div className="flex justify-center"><UserButton /></div>
          ) : (
            <div className="flex items-center gap-3">
              <UserButton />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 font-medium truncate">{email}</p>
                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 uppercase tracking-wide ${planCls}`}>{planLabel}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile/tablet sidebar ───────────────────────────────────────────── */}

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
        {/* Header with close button */}
        <div className="flex items-center h-14 shrink-0 border-b border-white/10 px-4">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Image src="/images/datafyle.png" alt="" width={18} height={18} className="w-4 h-4 object-contain brightness-0 invert" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight whitespace-nowrap">
              Data<span className="text-blue-200">fyle</span>
            </span>
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
          <NavItems onItemClick={onMobileClose} />
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 px-4 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 font-medium truncate">{email}</p>
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 uppercase tracking-wide ${planCls}`}>{planLabel}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
