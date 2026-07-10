'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, Shield, Calendar } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'

interface Props {
  adminEmail: string
  today: string
  children: React.ReactNode
}

export function AdminShell({ adminEmail, today, children }: Props) {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  function toggle() {
    setCollapsed((c) => {
      localStorage.setItem('admin-sidebar-collapsed', String(!c))
      return !c
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 z-30 bg-white border-b border-slate-100 flex items-center px-4 gap-3 shadow-sm">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors shrink-0"
        >
          <Menu size={18} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
            <Image
              src="/images/datafyle.png"
              alt="Datafyle"
              width={16}
              height={16}
              className="w-4 h-4 object-contain brightness-0 invert"
            />
          </div>
          <div>
            <span className="font-bold text-[#1E293B] text-[15px] tracking-tight">
              Data<span className="text-[#2563EB]">fyle</span>
            </span>
            <span className="ml-1.5 text-[10px] font-semibold text-red-500 uppercase tracking-wide">Admin</span>
          </div>
        </div>
      </div>

      <AdminSidebar
        collapsed={collapsed}
        onToggle={toggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        adminEmail={adminEmail}
      />

      <div
        className={`flex-1 min-h-screen flex flex-col pt-14 md:pt-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        {/* Sticky top header — desktop only */}
        <header className="hidden md:flex sticky top-0 z-20 bg-white border-b border-slate-100 h-16 items-center px-6 gap-4 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1E293B] leading-none">Admin Panel</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-64">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
            <Calendar size={12} className="text-[#2563EB]" />
            <span>{today}</span>
          </div>
        </header>

        {/* Mobile sub-header */}
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-2">
          <Shield size={13} className="text-red-500 shrink-0" />
          <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
