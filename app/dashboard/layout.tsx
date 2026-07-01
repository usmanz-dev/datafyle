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

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: { lastLoginAt: new Date() },
    })
  } catch {
    // User may not exist in DB yet if webhook hasn't fired
  }

  return <>{children}</>
}
