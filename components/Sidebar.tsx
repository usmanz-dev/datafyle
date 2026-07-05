'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Upload, Database, FileText,
  Users, Settings, ChevronLeft, ChevronRight, Lock,
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

interface Props {
  plan: string
  email: string
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ plan, email, collapsed, onToggle }: Props) {
  const pathname = usePathname()
  const planCls   = PLAN_COLORS[plan as keyof typeof PLAN_COLORS]   ?? PLAN_COLORS.free
  const planLabel = PLAN_LABELS[plan as keyof typeof PLAN_LABELS]   ?? 'FREE'

  return (
    <>
      {/* Desktop sidebar — no overflow-hidden so the toggle button is never clipped */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-[#2563EB] z-30 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-60'}`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 shrink-0 relative border-b border-white/10">
          {collapsed ? (
            <div className="w-full flex items-center justify-center">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Image
                  src="/images/datafyle.png"
                  alt="Datafyle"
                  width={22}
                  height={22}
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center px-4 gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Image
                  src="/images/datafyle.png"
                  alt=""
                  width={22}
                  height={22}
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
              </div>
              <span className="font-bold text-white text-[16px] tracking-tight whitespace-nowrap">
                Data<span className="text-blue-200">fyle</span>
              </span>
            </div>
          )}
          {/* Toggle button — positioned outside sidebar edge; visible because aside has no overflow-hidden */}
          <button
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border-2 border-[#2563EB] shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10"
          >
            {collapsed
              ? <ChevronRight size={13} className="text-[#2563EB]" />
              : <ChevronLeft  size={13} className="text-[#2563EB]" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV.map(({ href, icon: Icon, label, badge, lockedFor, exact, uploadAnchor }) => {
            const isActive = uploadAnchor ? false : exact ? pathname === href : pathname.startsWith(href)
            const locked = lockedFor?.includes(plan)
            return (
              <Link
                key={label}
                href={href}
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
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1E293B] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                    {label}{locked && badge ? ` (${badge})` : ''}
                  </span>
                )}
              </Link>
            )
          })}
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

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2563EB] z-30 shadow-[0_-2px_12px_rgba(37,99,235,0.3)]">
        <div className="flex">
          {[
            { href: '/dashboard',         icon: LayoutDashboard, label: 'Home',    exact: true  },
            { href: '/dashboard#upload',  icon: Upload,          label: 'Upload',  exact: false },
            { href: '/dashboard/reports', icon: FileText,        label: 'Reports', exact: false },
            { href: '/settings',          icon: Settings,        label: 'Settings',exact: false },
          ].map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href.split('#')[0])
            return (
              <Link
                key={label}
                href={href}
                className={`flex-1 flex flex-col items-center pt-2.5 pb-3 gap-1 text-[10px] font-semibold transition-colors min-h-14 ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Icon size={22} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
