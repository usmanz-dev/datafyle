'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'

interface Props {
  plan: string
  email: string
  children: React.ReactNode
}

export function DashboardShell({ plan, email, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)

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
      <Sidebar collapsed={collapsed} onToggle={toggle} plan={plan} email={email} />
      <main
        className={`min-h-screen pb-20 md:pb-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
