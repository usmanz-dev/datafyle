'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface Props {
  plan: string
  email: string
  children: React.ReactNode
}

export function DashboardShell({ plan, email, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  function toggle() {
    setCollapsed((c) => {
      localStorage.setItem('sidebar-collapsed', String(!c))
      return !c
    })
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8]">

      {/* Mobile top bar — only visible on mobile */}
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
          <span className="font-bold text-[#1E293B] text-[15px] tracking-tight">
            Data<span className="text-[#2563EB]">fyle</span>
          </span>
        </div>
      </div>

      <Sidebar
        collapsed={collapsed}
        onToggle={toggle}
        plan={plan}
        email={email}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        className={`min-h-screen pt-14 md:pt-0 pb-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
