import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const clerk = await currentUser()
  const email = clerk?.emailAddresses?.[0]?.emailAddress ?? ''

  if (!email || email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      <main className="ml-56 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
