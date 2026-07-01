import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  await prisma.user.update({
    where: { clerkId: userId },
    data: { lastLoginAt: new Date() },
  })

  return <>{children}</>
}
