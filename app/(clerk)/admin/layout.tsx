import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminShell } from './AdminShell'

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
    <AdminShell adminEmail={email} today={today}>
      {children}
    </AdminShell>
  )
}
