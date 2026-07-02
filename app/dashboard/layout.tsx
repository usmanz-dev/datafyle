import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar
        plan={user?.plan ?? 'free'}
        email={user?.email ?? ''}
      />
      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
