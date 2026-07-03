import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { SettingsClient } from './SettingsClient'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [clerkUser, user] = await Promise.all([
    currentUser(),
    prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true },
    }),
  ])

  if (!user) redirect('/sign-in')

  const subscription = user.subscription ?? null

  return (
    <SettingsClient
      profile={{
        name: clerkUser?.fullName ?? user.name ?? '',
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? user.email,
        imageUrl: clerkUser?.imageUrl ?? null,
      }}
      plan={user.plan}
      docsUsed={user.docsUsed}
      docsLimit={user.docsLimit}
      totalDocsProcessed={user.totalDocsProcessed}
      paidAt={user.paidAt?.toISOString() ?? null}
      cancelledAt={user.cancelledAt?.toISOString() ?? null}
      renewsAt={subscription?.renewsAt?.toISOString() ?? null}
    />
  )
}
