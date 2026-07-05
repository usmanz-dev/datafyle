import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'
import { Shield, Calendar } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const clerk = await currentUser()
  const email = clerk?.emailAddresses?.[0]?.emailAddress ?? ''

  if (!email || email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <div className="ml-60 flex-1 min-h-screen flex flex-col">
        {/* Sticky top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 h-16 flex items-center px-6 gap-4 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1E293B] leading-none">Admin Panel</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-64">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
            <Calendar size={12} className="text-[#2563EB]" />
            <span>{today}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
