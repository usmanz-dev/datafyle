import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardShell } from '@/components/DashboardShell'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })

  return (
    <DashboardShell plan={user?.plan ?? 'free'} email={user?.email ?? ''}>
      {children}
    </DashboardShell>
  )
}
